/*
 * @Author: jiangjin
 * @Date: 2021-09-09 15:13:55
 * @LastEditTime: 2021-09-14 20:58:48
 * @LastEditors: jiangjin
 * @Description:
 *
 */

import { useSwapMiningContract } from '@/hooks/useContract'
import { useDataAndBlockChangedUpdate, useOnlyDataChangedUpdate } from '@/hooks/useEqualHandler'
import { useActiveWeb3React } from '@/hooks/web3'
import { EqualityFn, useSingleCallResult, useSingleContractMultipleResult } from '@/store/multicall/hooks'
import { deepEqual, shallowEqualArr } from '@/utils/shallowEqual'
import { BigNumber } from '@ethersproject/bignumber'
import React, { memo, useCallback, useEffect, useMemo } from 'react'
import { shallowEqual } from 'react-redux'
import styled from 'styled-components/macro'

function TestCallContract() {
  const swapMiningContract = useSwapMiningContract()
  const { account, chainId } = useActiveWeb3React()

  // const userBalanceResult = useSingleCallResult(contract, 'balance', [])

  // 对比状态管理器中的callResult前后是否相等
  // const equalHandler = useOnlyDataChangedUpdate() // 只关心data模式，可能会导致数据不同步，适用于数据实时性不高的场景，但可以提高性能
  // const equalHandler = useDataAndBlockChangedUpdate() // 关心blockNumber和data，默认节流方式

  // 输入参数节流，否则每次都会创建新的数组传入useSingleCall，导致性能损耗
  const input = useMemo(() => [account ?? undefined], [account])

  const inputs = useMemo(() => [[account ?? undefined], [account ?? undefined]], [account])

  const rewardInfoResult = useSingleCallResult(swapMiningContract, 'rewardInfo', input)

  const rewardInfoResults = useSingleContractMultipleResult(swapMiningContract, 'rewardInfo', inputs)

  // 传入对比模式
  // const rewardInfoResult = useSingleCallResult(swapMiningContract, 'rewardInfo', inputs, undefined, equalHandler)

  const reward = useMemo(() => {
    const bigReward: BigNumber | undefined = rewardInfoResult.result?.[0]
    return bigReward?.toString()
  }, [rewardInfoResult.result])

  const rewards = useMemo(() => {
    return rewardInfoResults.map((rewardResult) => {
      return rewardResult.result
    })
  }, [rewardInfoResults])

  console.debug('[调试](rewardInfoResult):', rewardInfoResult)
  useEffect(() => {
    console.debug('[调试](reward, rewards):', reward, rewards)
  }, [reward, rewards])

  return <>TestCallContract</>
}

export default memo(TestCallContract)
