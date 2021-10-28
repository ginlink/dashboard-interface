/*
 * @Author: jiangjin
 * @Date: 2021-09-09 18:59:59
 * @LastEditTime: 2021-09-16 14:52:40
 * @LastEditors: jiangjin
 * @Description:
 *  Application轮询数据
 */

import useDebounce from '@/hooks/useDebounce'
import useIsWindowVisible from '@/hooks/useIsWindowVisible'
import { useActiveWeb3React } from '@/hooks/web3'
import { deepEqual } from '@/utils/shallowEqual'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../state'
import { updateBlockNumberAction } from './action'

function ApplicationUpdater() {
  const isWindowVisiable = useIsWindowVisible()
  const { library, chainId } = useActiveWeb3React()
  const dispatch = useDispatch()
  const prevBlockNumberMap = useSelector((state: RootState) => state.application.blockNumber, deepEqual)

  const [state, setState] = useState<{ chainId: number | undefined; blockNumber: number | undefined }>({
    chainId,
    blockNumber: undefined,
  })

  const blockNumberCallback = useCallback(
    (blockNumber) => {
      setState((prev) => {
        if (chainId === prev.chainId) {
          if (prev.blockNumber && prev.blockNumber > blockNumber) {
            return { blockNumber: prev.blockNumber, chainId }
          } else {
            return { blockNumber, chainId }
          }
        }

        // 如果当前chainId不等于以前的ID，则认为是异常情况
        // 则返回以前数据即可，由于chainId变化，会很快重新拉取区块
        // 所以不用担心数据问题，这里返回的值只是让程序正常执行
        return prev
      })
    },
    [chainId]
  )

  useEffect(() => {
    if (!library || !isWindowVisiable || !chainId) return

    // 先更新一下，避免切链数据混乱
    setState({ chainId, blockNumber: undefined })

    console.debug('[chainId]:', chainId)

    library
      .getBlockNumber()
      .then(blockNumberCallback)
      .catch((error) => console.log(`获取最新区块编号失败[${chainId}](${error})`))

    library.on('block', blockNumberCallback)
    return () => {
      library.removeListener('block', blockNumberCallback)
    }
  }, [blockNumberCallback, chainId, isWindowVisiable, library])

  // 节流，只要最新的一个块编号
  const debouncedBlockNumber = useDebounce(state, 100)

  const prevBlockNumber = useMemo(() => {
    if (!chainId) return undefined

    return prevBlockNumberMap[chainId]
  }, [chainId, prevBlockNumberMap])

  const blockNumber = useMemo(() => debouncedBlockNumber.blockNumber, [debouncedBlockNumber.blockNumber])

  // debugger
  // 111111111

  useEffect(() => {
    if (!chainId || !blockNumber) return

    // 防止重复触发
    if (blockNumber == prevBlockNumber) return

    // console.debug('[updateBlockNumberAction](blockNumber, prevBlockNumber):', blockNumber, prevBlockNumber)

    dispatch(updateBlockNumberAction(chainId, Math.max(prevBlockNumber ?? 0, blockNumber)))
  }, [blockNumber, chainId, dispatch, prevBlockNumber])

  return null
}

export default memo(ApplicationUpdater)
