/*
 * @Author: jiangjin
 * @Date: 2021-09-09 16:43:28
 * @LastEditTime: 2021-09-19 01:24:40
 * @LastEditors: jiangjin
 * @Description:
 *   multicall's hooks
 */

import { Contract } from '@ethersproject/contracts'
import { BigNumber } from '@ethersproject/bignumber'
import { useCallback, useEffect, useMemo } from 'react'
import {
  addMulticallListenerAction,
  Call,
  CallResultsProps,
  ListenerOptions,
  parseCallKey,
  removeMulticallListenersAction,
  toCallKey,
  updateMulticallListenersAction,
  UPDATE_MULTICALL_LISTENER,
} from './reducer'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../state'
import { useActiveWeb3React } from '@/hooks/web3'
import { FunctionFragment, Interface } from '@ethersproject/abi'
import { useBlockNumber } from '@/hooks/useBlockNumber'
import { useDataAndBlockChangedUpdate, useOnlyDataChangedUpdate } from '@/hooks/useEqualHandler'

type MethodArg = string | number | BigNumber
type MethodArgs = Array<MethodArg | MethodArg[]>

function isMethodArg(x: unknown): x is MethodArg {
  return BigNumber.isBigNumber(x) || ['string', 'number'].indexOf(typeof x) !== -1
}

// 验证参数必须为BigNumber | string | number
function isValidMethodArgs(x: unknown): x is MethodArgs | undefined {
  return (
    x === undefined ||
    (Array.isArray(x) && x.every((xi) => isMethodArg(xi) || (Array.isArray(xi) && xi.every(isMethodArg))))
  )
}

export type OptionalMethodInputs = Array<MethodArg | MethodArg[] | undefined> | undefined

export interface CallResult {
  valid: boolean
  blockNumber: number | undefined
  data: string | undefined
}

export type EqualityFn = (left: CallResultsProps, right: CallResultsProps) => boolean

const INVALID_RESULT: CallResult = { valid: false, blockNumber: undefined, data: undefined }

function useCallsData(calls: (Call | undefined)[], options?: ListenerOptions, equalityFn?: EqualityFn) {
  // 序列化数据，用于节流，避免多次创建listener
  const serializedCallKeys = useMemo(() => {
    return JSON.stringify(
      calls
        .filter((x): x is Call => Boolean(x))
        .map(toCallKey)
        .sort() ?? []
    )
  }, [calls])

  // 疑问：为什么这里不直接
  // JSON.stringify(
  //    calls
  //      .filter((x): x is Call => Boolean(x))
  //      .sort() ?? []
  // )
  // 而中间要加一层map，将calls转化为callKey呢？

  // const serializedString1 = JSON.stringify(
  //   calls
  //     .filter((x): x is Call => Boolean(x))
  //     .map(toCallKey)
  //     .sort() ?? []
  // )
  // const serializedString2 = JSON.stringify(calls.filter((x): x is Call => Boolean(x)).sort() ?? [])
  // console.debug('[](serializedString1, serializedString2):', serializedString1, serializedString2)
  // console.debug(
  //   '[](serializedString1, serializedString2):',
  //   JSON.parse(serializedString1),
  //   JSON.parse(serializedString2)
  // )

  const { chainId } = useActiveWeb3React()

  const dispatch = useDispatch()
  const callResults = useSelector((state: RootState) => state.multical.callResults, equalityFn)
  // const callResults = useSelector((state: RootState) => state.multical.callResults)

  // debugger
  useEffect(() => {
    const unserializeCallKeys: string[] = JSON.parse(serializedCallKeys)

    if (!chainId || unserializeCallKeys.length === 0) return undefined
    const calls = unserializeCallKeys.map(parseCallKey)
    dispatch(
      addMulticallListenerAction({
        calls,
        chainId,
        options,
      })
    )

    console.debug('[](增加了):')
    return () => {
      console.debug('[](清除了):')
      dispatch(
        removeMulticallListenersAction({
          chainId,
          calls,
          options,
        })
      )
    }
  }, [chainId, dispatch, serializedCallKeys, options])

  // useEffect(() => {}, [input])

  // debugger
  // console.log('[](callResults):', callResults)

  return useMemo(() => {
    return calls.map((call) => {
      if (!chainId || !call) return INVALID_RESULT

      const result = callResults?.[chainId]?.[toCallKey(call)]

      let data: string | undefined
      if (result?.data && result.data !== '0x') {
        data = result.data
      }

      return { valid: true, data, blockNumber: result?.blockNumber }
    })
  }, [callResults, calls, chainId])
  // }, [callResults, calls, chainId])
}
export interface Result extends ReadonlyArray<any> {
  readonly [key: string]: any
}
export interface CallState {
  valid: boolean
  result: Result | undefined
  loading: boolean
  syncing: boolean
  error: boolean
}

const INVALID_CALL_STATE: CallState = { valid: false, result: undefined, loading: false, syncing: false, error: false }
const LOADING_CALL_STATE: CallState = { valid: true, result: undefined, loading: true, syncing: true, error: false }

function toPackageState(
  callResult: CallResult | undefined,
  contractInterface: Interface | undefined,
  fragment: FunctionFragment | undefined,
  latestBlockNumber: number | undefined
) {
  // debugger
  if (!callResult) return INVALID_CALL_STATE

  const { valid, data, blockNumber } = callResult

  if (!valid) return INVALID_CALL_STATE

  if (valid && !blockNumber) return LOADING_CALL_STATE

  if (!fragment || !contractInterface || !latestBlockNumber) return LOADING_CALL_STATE

  // 有数据且不为'0x'
  const success = data && data.length > 2
  const syncing = (blockNumber ?? 0) <= latestBlockNumber

  // console.debug('[syncing](blockNumber, latestBlockNumber):', blockNumber, latestBlockNumber)

  let result: Result | undefined
  if (success && data) {
    try {
      result = contractInterface.decodeFunctionResult(fragment, data)
    } catch (err) {
      console.debug('[解析合约参数失败](toPackageState)')
      return {
        valid: true,
        loading: false,
        error: true,
        syncing,
        result,
      }
    }
  }

  return {
    valid: true,
    loading: false,
    error: !success,
    syncing,
    result,
  }
}

// 此方法用于静态轮询拉取数据用，调用合约，请直接通过方法调用

// 同一个合约，一个结果
export function useSingleCallResult(
  contract: Contract | undefined,
  methodName: string,
  inputs?: OptionalMethodInputs,
  options?: ListenerOptions,
  equalityFn?: EqualityFn,
  callback?: (result: CallState, updateBlockPerFetch: (options: ListenerOptions) => void) => void
) {
  const { chainId } = useActiveWeb3React()
  const dispatch = useDispatch()

  const fragment = useMemo(() => contract?.interface?.getFunction(methodName), [contract?.interface, methodName])

  const calls = useMemo<Call[]>(() => {
    // 请求参数inputs可以为undefined，此时调用没有参数的方法
    return contract && fragment && isValidMethodArgs(inputs)
      ? [
          {
            address: contract.address,
            callData: contract.interface.encodeFunctionData(fragment, inputs),
          },
        ]
      : []
  }, [contract, fragment, inputs])

  // TODO [更新]默认每次都刷新 2021-09-15 22:46:36
  // 只关心blockNumber和data变化，
  // 去除fetchingBlockNumber的影响
  // const equalHandler = useDataAndBlockChangedUpdate()

  const result = useCallsData(calls, options, equalityFn)[0]
  const latestBlockNumber = useBlockNumber()

  // debugger

  // 此数据每次dispath都会被更新，因为每次区块（blockNumber）都更新了
  // 节流请外部处理，例子见：src/pages/TestCallContract.tsx

  const packagedResult = useMemo(
    () => toPackageState(result, contract?.interface, fragment, latestBlockNumber),
    [contract?.interface, fragment, latestBlockNumber, result]
  )

  // 请求完毕后的回调，数据变动时才回调，一般用于控制轮询间隔
  const updateBlockPerFetch = useCallback(
    (options: ListenerOptions) => {
      if (!chainId || !calls) return

      dispatch(updateMulticallListenersAction({ chainId, calls, options }))
    },
    [calls, chainId, dispatch]
  )

  useEffect(() => {
    callback && callback(packagedResult, updateBlockPerFetch)
  }, [callback, packagedResult, updateBlockPerFetch])

  return packagedResult
}

// 同一个合约，多个结果
export function useSingleContractMultipleResult(
  contract: Contract | undefined,
  methodName: string,
  inputs: OptionalMethodInputs[] /* 多个结果就需要多个参数 */,
  options?: ListenerOptions,
  equalityFn?: EqualityFn,
  callback?: (result: CallState, updateBlockPerFetch: (options: ListenerOptions) => void) => void
) {
  const { chainId } = useActiveWeb3React()
  const dispatch = useDispatch()
  const fragment = useMemo(() => contract?.interface?.getFunction(methodName), [contract?.interface, methodName])

  const calls = useMemo<Call[]>(() => {
    // 一次性验证所有输入参数，有一个不合法则认为参数异常，返回[]
    /* 空参数可以通过isValidMethodArgs检查 */
    return contract && fragment && inputs.length > 0 && inputs.every((input) => isValidMethodArgs(input))
      ? inputs.map((input) => {
          return {
            address: contract.address,
            callData: contract.interface.encodeFunctionData(fragment, input),
          }
        })
      : [] /* 空calls在添加listener的时候会被忽略，注意与空参数区分 */
  }, [contract, fragment, inputs])

  // const equalHandler = useDataAndBlockChangedUpdate()

  // TODO [更新]默认每次都刷新 2021-09-15 22:46:36
  const results = useCallsData(calls, options, equalityFn)
  const latestBlockNumber = useBlockNumber()

  const packagedResult = useMemo(() => {
    // 返回多个结果
    return results.map((result) => toPackageState(result, contract?.interface, fragment, latestBlockNumber))
  }, [contract?.interface, fragment, latestBlockNumber, results])

  // 请求完毕后的回调，数据变动时才回调，一般用于控制轮询间隔
  const updateBlockPerFetch = useCallback(
    (options: ListenerOptions) => {
      if (!chainId || !calls) return

      dispatch(updateMulticallListenersAction({ chainId, calls, options }))
    },
    [calls, chainId, dispatch]
  )

  useEffect(() => {
    callback && packagedResult.forEach((result) => callback(result, updateBlockPerFetch))
  }, [callback, packagedResult, updateBlockPerFetch])

  return packagedResult
}

// TODO 多个合约，一个结果；多个合约，多个结果
// 目前没搞懂上面两个的应用场景

export function useMultipleContractSingleData(
  addresses: (string | undefined)[],
  contractInterface: Interface,
  methodName: string,
  callInputs?: OptionalMethodInputs,
  options?: ListenerOptions,
  gasRequired?: number
): CallState[] {
  const fragment = useMemo(() => contractInterface.getFunction(methodName), [contractInterface, methodName])
  const callData: string | undefined = useMemo(
    () =>
      fragment && isValidMethodArgs(callInputs)
        ? contractInterface.encodeFunctionData(fragment, callInputs)
        : undefined,
    [callInputs, contractInterface, fragment]
  )

  const calls = useMemo(
    () =>
      fragment && addresses && addresses.length > 0 && callData
        ? addresses.map<Call | undefined>((address) => {
            return address && callData
              ? {
                  address,
                  callData,
                  ...(gasRequired ? { gasRequired } : {}),
                }
              : undefined
          })
        : [],
    [addresses, callData, fragment, gasRequired]
  )

  const results = useCallsData(calls, options)

  const latestBlockNumber = useBlockNumber()

  return useMemo(() => {
    return results.map((result) => toPackageState(result, contractInterface, fragment, latestBlockNumber))
  }, [fragment, results, contractInterface, latestBlockNumber])
}
