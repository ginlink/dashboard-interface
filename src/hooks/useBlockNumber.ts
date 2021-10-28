/*
 * @Author: jiangjin
 * @Date: 2021-09-09 18:30:44
 * @LastEditTime: 2021-09-09 18:36:54
 * @LastEditors: jiangjin
 * @Description:
 *
 */

import { RootState } from '@/store/state'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useActiveWeb3React } from './web3'

export function useBlockNumber() {
  // TODO 将blockNumber的更新放入轮询中
  const { chainId } = useActiveWeb3React()

  return useSelector((state: RootState) => state.application.blockNumber[chainId ?? -1])
}
