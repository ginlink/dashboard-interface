import { useEffect, useMemo, useRef } from 'react'
import { Multicall2 } from '@/abis/types/'
import { useActiveWeb3React } from '../../hooks/web3'
import { useMulticall2Contract } from '../../hooks/useContract'
import useDebounce from '../../hooks/useDebounce'
import chunkArray from '../../utils/chunkArray'
import { retry, RetryableError } from '../../utils/retry'
import {
  Call,
  CallLitenersProps,
  CallResultsProps,
  parseCallKey,
  updateFetchingResultsAction,
  updateResultsAction,
} from './reducer'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../state'
import { useBlockNumber } from '@/hooks/useBlockNumber'
import { MAX_ACCESS_SPACING } from '@/constants/misc'

// 只请求一次的配置
export const ONCE_FETCH_OPTION = {
  blocksPerFetch: 999999999,
}

// 间隔一次再请求
export const INTERVAL_1_FETCH_OPTION = {
  blocksPerFetch: 9,
}

// 间隔十次再请求
export const INTERVAL_10_FETCH_OPTION = {
  blocksPerFetch: 99,
}

/**
 * Fetches a chunk of calls, enforcing a minimum block number constraint
 * @param multicall2Contract multicall contract to fetch against
 * @param chunk chunk of calls to make
 * @param minBlockNumber minimum block number of the result set
 */
async function fetchChunk(
  multicall2Contract: Multicall2,
  chunk: Call[],
  minBlockNumber: number
): Promise<{
  results: { success: boolean; returnData: string }[]
  blockNumber: number
}> {
  console.debug('Fetching chunk', chunk, minBlockNumber)
  let resultsBlockNumber: number
  let results: { success: boolean; returnData: string }[]
  try {
    const { blockNumber, returnData } = await multicall2Contract.callStatic.tryBlockAndAggregate(
      false,
      chunk.map((obj) => ({ target: obj.address, callData: obj.callData }))
    )
    resultsBlockNumber = blockNumber.toNumber()
    results = returnData
  } catch (error) {
    console.debug('Failed to fetch chunk', error)
    throw error
  }

  console.debug(
    '[Fetch chunk](results, resultsBlockNumber, minBlockNumber):',
    results,
    resultsBlockNumber,
    minBlockNumber,
    resultsBlockNumber < minBlockNumber
  )
  if (resultsBlockNumber < minBlockNumber) {
    const retryMessage = `Fetched results for old block number: ${resultsBlockNumber.toString()} vs. ${minBlockNumber}`
    console.debug(retryMessage)
    throw new RetryableError(retryMessage)
  }
  return { results, blockNumber: resultsBlockNumber }
}

/**
 * From the current all listeners state, return each call key mapped to the
 * minimum number of blocks per fetch. This is how often each key must be fetched.
 * @param allListeners the all listeners state
 * @param chainId the current chain id
 */
export function activeListeningKeys(allListeners: CallLitenersProps, chainId?: number): { [callKey: string]: number } {
  console.debug('[activeListeningKeys](allListeners):', allListeners)
  if (!allListeners || !chainId) return {}
  const listeners = allListeners[chainId]
  if (!listeners) return {}

  return Object.keys(listeners).reduce<{ [callKey: string]: number }>((memo, callKey) => {
    const keyListeners = listeners[callKey]

    memo[callKey] = Object.keys(keyListeners)
      .filter((key) => {
        const blocksPerFetch = parseInt(key)
        if (blocksPerFetch <= 0) return false
        return keyListeners[blocksPerFetch] > 0
      })
      .reduce((previousMin, current) => {
        return Math.min(previousMin, parseInt(current))
      }, Infinity)
    return memo
  }, {})
}

/**
 * Return the keys that need to be refetched
 * @param callResults current call result state
 * @param listeningKeys each call key mapped to how old the data can be in blocks
 * @param chainId the current chain id
 * @param latestBlockNumber the latest block number
 */
export function outdatedListeningKeys(
  callResults: CallResultsProps,
  listeningKeys: { [callKey: string]: number },
  chainId: number | undefined,
  latestBlockNumber: number | undefined
): string[] {
  // debugger
  // 222
  if (!chainId || !latestBlockNumber) return []
  const results = callResults[chainId]
  // no results at all, load everything
  if (!results) return Object.keys(listeningKeys)

  return Object.keys(listeningKeys).filter((callKey) => {
    const blocksPerFetch = listeningKeys[callKey]

    const data = callResults[chainId][callKey]
    // no data, must fetch
    if (!data) return true

    const minDataBlockNumber = latestBlockNumber - (blocksPerFetch - 1)

    // console.debug(
    //   '[重试](data.fetchingBlockNumber, minDataBlockNumber, 左值大于右值，则不会再次请求):',
    //   data.fetchingBlockNumber,
    //   minDataBlockNumber,
    //   blocksPerFetch,
    //   listeningKeys
    // )

    // data.fetchingBlockNumber为上一次，准备去获取数据的blockNumber，是变化的，
    //   fetchingBlockNumber变化的前提是它已经过期
    //   什么时候会过期？第一次和本条件成立的时候
    // 也就是说blocksPerFetch表示的是最新块和当前请求到的块的间隔
    // 例如：blocksPerFetch为1，则间隔为0，也就是每次都请求
    // 例如：blocksPerFetch为2, 则间隔为1， 也就是隔一个块再请求，注意是隔一个块，不是隔一次
    // 例如：blocksPerFetch为10，则间隔为10，也就是隔10隔块再请求

    // already fetching it for a recent enough block, don't refetch it
    if (data.fetchingBlockNumber && data.fetchingBlockNumber >= minDataBlockNumber) return false

    // if data is older than minDataBlockNumber, fetch it
    return !data.blockNumber || data.blockNumber < minDataBlockNumber
  })
}

export default function Updater(): null {
  const dispatch = useDispatch()
  // const state = useSelector((state: RootState) => state.multical)

  const callLiteners = useSelector((state: RootState) => state.multical.callLiteners)
  const callResults = useSelector((state: RootState) => state.multical.callResults)

  // wait for listeners to settle before triggering updates
  const debouncedListeners = useDebounce(callLiteners, 100)
  const latestBlockNumber = useBlockNumber()
  const { chainId } = useActiveWeb3React()
  const multicall2Contract = useMulticall2Contract()
  const cancellations = useRef<{ blockNumber: number; cancellations: (() => void)[] }>()

  const listeningKeys: { [callKey: string]: number } = useMemo(() => {
    return activeListeningKeys(debouncedListeners, chainId)
  }, [debouncedListeners, chainId])

  const unserializedOutdatedCallKeys = useMemo(() => {
    return outdatedListeningKeys(callResults, listeningKeys, chainId, latestBlockNumber)
  }, [chainId, callResults, listeningKeys, latestBlockNumber])

  const serializedOutdatedCallKeys = useMemo(
    () => JSON.stringify(unserializedOutdatedCallKeys.sort()),
    [unserializedOutdatedCallKeys]
  )

  useEffect(() => {
    const outdatedCallKeys: string[] = JSON.parse(serializedOutdatedCallKeys)
    outdatedCallKeys.length > 0 && console.debug('[当前正在轮询的数据个数]():', outdatedCallKeys.length)
  }, [serializedOutdatedCallKeys])

  useEffect(() => {
    // debugger

    if (!latestBlockNumber || !chainId || !multicall2Contract) return

    const outdatedCallKeys: string[] = JSON.parse(serializedOutdatedCallKeys)

    if (outdatedCallKeys.length === 0) return
    const calls = outdatedCallKeys.map((key) => parseCallKey(key))

    const chunkedCalls = chunkArray(calls)

    if (cancellations.current?.blockNumber !== latestBlockNumber) {
      cancellations.current?.cancellations?.forEach((c) => c())
    }

    dispatch(
      updateFetchingResultsAction({
        calls,
        chainId,
        fetchingBlockNumber: latestBlockNumber,
      })
    )

    cancellations.current = {
      blockNumber: latestBlockNumber,
      cancellations: chunkedCalls.map((chunk, index) => {
        const { cancel, promise } = retry(
          () => fetchChunk(multicall2Contract, chunk, latestBlockNumber - 2),
          {
            n: Infinity,
            minWait: 2000,
            maxWait: 3500,
          }
          // () => fetchChunk(multicall2Contract, chunk, latestBlockNumber - MAX_ACCESS_SPACING),
          // 重试等待间隔从1000~2500调整为2000~3500，加大间隔时间
          // 在数据量多的时候不会出现拥堵现象

          // MAX_ACCESS_SPACING为允许块最大容错数，给一个容错可以避免多次请求，但数据不会受影响 节流
          // TODO 为了保证扩展性，可以将MAX_ACCESS_SPACING写入状态管理器，每一个请求都具有此参数，
          // 用于区分实时性高的数据，和不高的数据，这样可以节流和加快访问速度

          // 注意：目前这里（MAX_ACCESS_SPACING）暂不做处理，因为不知道后果会怎样
        )

        // debugger
        promise
          .then(({ results: returnData, blockNumber: fetchBlockNumber }) => {
            cancellations.current = { cancellations: [], blockNumber: latestBlockNumber }

            // accumulates the length of all previous indices
            const firstCallKeyIndex = chunkedCalls.slice(0, index).reduce<number>((memo, curr) => memo + curr.length, 0)
            const lastCallKeyIndex = firstCallKeyIndex + returnData.length

            const slice = outdatedCallKeys.slice(firstCallKeyIndex, lastCallKeyIndex)

            // TODO 目前不记录出错情况，因为数据轮询较快，出错后会很快再次访问
            // split the returned slice into errors and success
            const { erroredCalls, results } = slice.reduce<{
              erroredCalls: Call[]
              results: { [callKey: string]: string | null }
            }>(
              (memo, callKey, i) => {
                if (returnData[i].success) {
                  memo.results[callKey] = returnData[i].returnData ?? null
                } else {
                  memo.erroredCalls.push(parseCallKey(callKey))
                }
                return memo
              },
              { erroredCalls: [], results: {} }
            )

            // debugger
            // dispatch any new results
            if (Object.keys(results).length > 0) {
              dispatch(
                updateResultsAction({
                  chainId,
                  results,
                  blockNumber: fetchBlockNumber,
                })
              )
            }

            // 不记录出错情况
            // dispatch any errored calls
            // if (erroredCalls.length > 0) {
            //   console.debug('Calls errored in fetch', erroredCalls)
            //   dispatch(
            //     errorFetchingMulticallResults({
            //       calls: erroredCalls,
            //       chainId,
            //       fetchingBlockNumber: fetchBlockNumber,
            //     })
            //   )
            // }
          })
          .catch((error: any) => {
            if (error.isCancelledError) {
              console.debug('Cancelled fetch for blockNumber', latestBlockNumber)
              return
            }
            console.error('Failed to fetch multicall chunk', chunk, chainId, error)

            // 不记录出错情况
            // dispatch(
            //   errorFetchingMulticallResults({
            //     calls: chunk,
            //     chainId,
            //     fetchingBlockNumber: latestBlockNumber,
            //   })
            // )
          })
        return cancel
      }),
    }
  }, [chainId, multicall2Contract, dispatch, serializedOutdatedCallKeys, latestBlockNumber])

  return null
}
