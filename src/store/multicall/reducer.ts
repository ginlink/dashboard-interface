/*
 * @Author: jiangjin
 * @Date: 2021-09-09 15:28:45
 * @LastEditTime: 2021-09-16 11:03:02
 * @LastEditors: jiangjin
 * @Description:
 *   mutlticall reducer
 */

export const ADD_MULTICALL_LISTENER = 'ADD_MULTICALL_LISTENER'
export const REMOVE_MULTICALL_LISTENER = 'REMOVE_MULTICALL_LISTENER'
export const UPDATE_MULTICALL_LISTENER = 'UPDATE_MULTICALL_LISTENER'
export const FETCHING_MULTICALL_RESULT = 'FETCHING_MULTICALL_RESULT'
export const UPDATE_MULTICALL_RESULT = 'UPDATE_MULTICALL_RESULT'

export interface ListenerOptions {
  readonly blocksPerFetch?: number
}

export interface AddMulticallPayload {
  calls: any[]
  chainId: number
  options?: ListenerOptions
}
export interface RemoveMulticallPayload {
  chainId: number
  calls: Call[]
  options?: ListenerOptions
}
export interface UpdateMulticallPayload {
  chainId: number
  calls: Call[]
  options?: ListenerOptions
}

export interface FetchingMulticallPayload {
  calls: any[]
  chainId: number
  fetchingBlockNumber: number
}
export interface UpdateResultsPayload {
  chainId: number
  results: {
    [callkey: string]: string | undefined | null
  }
  blockNumber: number
}

export const addMulticallListenerAction = (payload: AddMulticallPayload) => {
  return { type: ADD_MULTICALL_LISTENER, payload }
}
export const removeMulticallListenersAction = (payload: RemoveMulticallPayload) => {
  return { type: REMOVE_MULTICALL_LISTENER, payload }
}
export const updateMulticallListenersAction = (payload: UpdateMulticallPayload) => {
  return { type: UPDATE_MULTICALL_LISTENER, payload }
}

export const updateFetchingResultsAction = (payload: FetchingMulticallPayload) => {
  return { type: FETCHING_MULTICALL_RESULT, payload }
}

export const updateResultsAction = (payload: UpdateResultsPayload) => {
  return { type: UPDATE_MULTICALL_RESULT, payload }
}

export interface Call {
  address: string
  callData: string
  gasRequired?: number
}

// 验证输入数据
const ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/
const LOWER_HEX_REGEX = /^0x[a-f0-9]*$/

export function toCallKey(call: Call): string {
  if (!ADDRESS_REGEX.test(call.address)) {
    throw new Error(`Invalid address: ${call.address}`)
  }
  if (!LOWER_HEX_REGEX.test(call.callData)) {
    throw new Error(`Invalid hex: ${call.callData}`)
  }

  let key = `${call.address}-${call.callData}`
  if (call.gasRequired) {
    if (!Number.isSafeInteger(call.gasRequired)) {
      throw new Error(`Invalid number: ${call.gasRequired}`)
    }
    key += `-${call.gasRequired}`
  }
  return key
}

export function parseCallKey(callKey: string): Call {
  const pcs = callKey.split('-')
  if (![2, 3].includes(pcs.length)) {
    throw new Error(`Invalid call key: ${callKey}`)
  }

  return {
    address: pcs[0],
    callData: pcs[1],
    ...(pcs[2] ? { gasRequired: Number.parseInt(pcs[2]) } : {}),
  }
}

export type CallResultsProps = {
  [chainId: number]: {
    [callKey: string]: {
      data?: string | null
      blockNumber?: number
      fetchingBlockNumber?: number
    }
  }
}
export type CallLitenersProps = {
  [chainId: number]: {
    [callKey: string]: {
      [blocksPerFetch: number]: number
    }
  }
}

export interface MulticalState {
  callResults: CallResultsProps

  callLiteners: CallLitenersProps
}

export const initData: MulticalState = {
  callResults: {},
  callLiteners: {},
}
export interface Cases {
  [type: string]: <T>(state: MulticalState, payload: T) => MulticalState
}

const cases: Cases = {
  [ADD_MULTICALL_LISTENER]: (state: MulticalState, payload: any) => {
    const { calls, chainId: chainId, options: { blocksPerFetch = 1 } = {} } = payload as AddMulticallPayload

    const listenerAdd: CallLitenersProps = JSON.parse(JSON.stringify(state.callLiteners))

    listenerAdd[chainId] = listenerAdd[chainId] ?? {}

    calls.forEach((call) => {
      const callKey = toCallKey(call)
      listenerAdd[chainId][callKey] = listenerAdd[chainId][callKey] ?? {}

      listenerAdd[chainId][callKey][blocksPerFetch] = (listenerAdd[chainId][callKey][blocksPerFetch] ?? 0) + 1
    })

    return { ...state, callLiteners: { ...listenerAdd } }
  },
  [REMOVE_MULTICALL_LISTENER]: (state: MulticalState, payload: any) => {
    const { calls, chainId, options: { blocksPerFetch = 1 } = {} } = payload as RemoveMulticallPayload

    const listeners = JSON.parse(JSON.stringify(state.callLiteners))

    if (!listeners[chainId]) return state

    calls.forEach((call) => {
      const callKey = toCallKey(call)
      const callItem = listeners[chainId][callKey]

      if (!callItem) return state
      if (!callItem[blocksPerFetch]) return state

      if (callItem[blocksPerFetch] === 1) {
        delete listeners[chainId][callKey][blocksPerFetch]
      } else {
        listeners[chainId][callKey][blocksPerFetch]--
      }
    })

    return { ...state, callLiteners: { ...listeners } }
  },
  [UPDATE_MULTICALL_LISTENER]: (state: MulticalState, payload: any) => {
    const { chainId, calls, options } = payload as UpdateMulticallPayload

    // const listeners = state.callLiteners
    const listeners = JSON.parse(JSON.stringify(state.callLiteners))

    if (!listeners[chainId]) return state

    const blocksPerFetch = options?.blocksPerFetch
    if (!blocksPerFetch) return state

    calls.forEach((call) => {
      const callKey = toCallKey(call)

      listeners[chainId][callKey] = {}

      listeners[chainId][callKey][blocksPerFetch] = 1
    })

    return { ...state, callLiteners: { ...listeners } }
  },
  [FETCHING_MULTICALL_RESULT]: (state: MulticalState, payload: any) => {
    const { calls, chainId, fetchingBlockNumber } = payload as FetchingMulticallPayload

    // 深拷贝
    const callResults: CallResultsProps = JSON.parse(JSON.stringify(state.callResults))

    calls.forEach((call) => {
      const callKey = toCallKey(call)

      callResults[chainId] = callResults[chainId] ?? {}

      const current = callResults[chainId][callKey]

      // debugger
      if (!current) {
        callResults[chainId][callKey] = {
          fetchingBlockNumber,
        }
      } else {
        // 拿到的blocknumber小于记录的，则认为异常数据，不处理
        if ((current.fetchingBlockNumber ?? 0) >= fetchingBlockNumber) return

        callResults[chainId][callKey].fetchingBlockNumber = fetchingBlockNumber
      }
    })

    return { ...state, callResults: { ...callResults } }
  },
  [UPDATE_MULTICALL_RESULT]: (state: MulticalState, payload: any) => {
    const { chainId, results, blockNumber } = payload as UpdateResultsPayload

    // 由于不涉及非序列化数据，所以可以使用JSON来进行深拷贝
    const callResults: CallResultsProps = JSON.parse(JSON.stringify(state.callResults))

    callResults[chainId] = callResults[chainId] ?? {}

    Object.keys(results).forEach((callKey) => {
      const current = callResults[chainId][callKey]

      if ((current?.blockNumber ?? 0) >= blockNumber) return

      callResults[chainId][callKey] = callResults[chainId][callKey] ?? {}

      callResults[chainId][callKey].data = results[callKey]
      callResults[chainId][callKey].blockNumber = blockNumber
    })

    // state.callResults = { ...callResults }
    // return state

    // TODO react-scripts@3和react-scripts@4版本间的差异还是比较大
    // 版本3通过上面的方式才能保证不全局刷新，而版本4用下面的方式才可以保证数据刷新，且不是全局刷新
    return { ...state, callResults: { ...callResults } }
  },
}

export default function multical(state: MulticalState = initData, { type, payload }: { type: string; payload: any }) {
  try {
    return cases[type](state, payload)
  } catch (err) {
    // console.debug('[multical](未匹配到action):', `${type}-${err}`)

    return state
  }
}
