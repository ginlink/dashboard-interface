/*
 * @Author: jiangjin
 * @Date: 2021-09-15 16:21:05
 * @LastEditTime: 2021-09-18 17:33:55
 * @LastEditors: jiangjin
 * @Description:
 *
 */

import { ApprovalState, useApproveCallback } from '@/hooks/useApproveCallback'
import { CurrencyAmount, MaxUint256, Token } from 'plugins/@uniswap/sdk-core/dist'
import React, { memo, useCallback, useEffect, useMemo } from 'react'
import { useActiveWeb3React } from '@/hooks/web3'
import { useTokenContract } from '@/hooks/useContract'

export const BUSD = '0x110887Fc420292dCe51C08504ceE377872D0Db66'
export const CON = '0x4781A0EF2A705C44Cc401E8670571b7ef94d6461'
export const BTC = '0x8ED5A0e0D77a854252A3de2A7fB6A1cBA157dD14'
function TestApproveToken() {
  const { chainId, account } = useActiveWeb3React()

  const usdtCurrencyAmount = useMemo(() => {
    if (!chainId) return

    const usdtCurrency = new Token(chainId, BUSD, 18, 'USDT')

    return CurrencyAmount.fromRawAmount(usdtCurrency, MaxUint256)
  }, [chainId])
  const tokenContract = useTokenContract(BUSD)

  const [approveState, ApproveCallback] = useApproveCallback(usdtCurrencyAmount, account ?? undefined)

  const cancelApprove = useCallback(async () => {
    if (!account) return

    await tokenContract?.approve(BUSD, 0)
  }, [account, tokenContract])

  const checkApprove = useCallback(async () => {
    if (!account) return
    const approval = await tokenContract?.allowance(account, BUSD)
    console.debug('[](approval):', approval?.toString())
  }, [account, tokenContract])

  // useEffect(() => {
  //   // console.debug('[approveState]:', approveState)

  //   // 进行授权，状态请通过approveState查询
  //   ApproveCallback()
  // }, [ApproveCallback])

  useEffect(() => {
    if (approveState === ApprovalState.NOT_APPROVED) {
      console.debug('[](approveState):', approveState)
    }
  }, [approveState])

  return (
    <>
      <button onClick={ApproveCallback}>授权</button>
      <button onClick={cancelApprove}>取消授权</button>
      <button onClick={checkApprove}>查询授权额度</button>
    </>
  )
}

export default memo(TestApproveToken)
