/*
 * @Author: jiangjin
 * @Date: 2021-09-26 14:40:22
 * @LastEditTime: 2021-09-26 16:07:14
 * @LastEditors: jiangjin
 * @Description:
 *
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useIsPcByScreenWidth } from '@/hooks/useIsPc'
import CollapseComponent from '../CollapseComponent'
import PositionHeaderCardH5 from '../PositionHeaderCardH5'
import PositionContentCardH5 from '../PositionContentCardH5'
import BaseCollapse from '../BaseCollapse'
import { collapseTypes } from '@/constants/collapseType'
import { useActiveWeb3React } from '@/hooks/web3'
import { useToken, useTokenBalance } from '@/hooks/token'
import { DataListBase } from '@/mock'
import { useVaultContract } from '@/hooks/useContract'
import { useSingleCallResult } from '@/store/multicall/hooks'
import BigNumber from 'bignumber.js'

export default function CollapseFather({
  item,
  deposit,
  withdraw,
  propActiveKey,
  changeActiveKey,
  type,
}: {
  deposit: () => void
  withdraw: () => void
  changeActiveKey: (key: any, item: DataListBase) => void
  item: DataListBase
  propActiveKey: string | undefined
  type: string
}) {
  const isPc = useIsPcByScreenWidth()

  const { account } = useActiveWeb3React()
  const [balance, setBalance] = useState<string | undefined>()

  const { token0, token1, lp_pool, vault_address } = useMemo(() => item ?? {}, [item])
  const currency0 = useToken(token0)
  const currency1 = useToken(token1)
  const currencyLp = useToken(lp_pool)

  // 查询币种的balance
  const amount = useTokenBalance(account ?? undefined, token1 ? currencyLp : currency0)?.toFixed()

  useEffect(() => {
    console.log('[查询币种的balance](amount):', amount)
    setBalance(amount)
  }, [amount])

  const lp_name = useMemo(() => {
    return currency1 ? `${currency0?.symbol}-${currency1?.symbol}` : currency0?.symbol
  }, [currency0?.symbol, currency1])

  // TODO 判断是否质押，金库中是否存在余额
  const [isStake, setIsStake] = useState<boolean>(false)

  // 查询金库中的balance
  const vaultContract = useVaultContract(vault_address)
  const inputs = useMemo(() => [account ?? undefined], [account])
  const balanceResult = useSingleCallResult(vaultContract, 'balanceOf', inputs)
  useEffect(() => {
    const balance = balanceResult.result?.[0] as BigNumber | undefined

    console.log('[查询金库中的balance](balance):', balance?.toString())

    balance?.gt(0) && setIsStake(true)
  }, [amount, balanceResult.result])

  function getPositionHeader(item: any) {
    return <PositionHeaderCardH5 type={type} item={item} lp_name={lp_name} balance={balance}></PositionHeaderCardH5>
  }
  function getPositionContent(item: any) {
    return (
      <PositionContentCardH5
        withdraw={withdraw}
        deposit={deposit}
        type={type}
        isStake={isStake}
        item={item}
      ></PositionContentCardH5>
    )
  }
  return (
    <>
      {isPc ? (
        <CollapseComponent
          propActiveKey={propActiveKey}
          changeActiveKey={(key: any) => changeActiveKey(key, item)}
          item={item}
          type={type}
          lp_name={lp_name}
          balance={balance}
          isStake={isStake}
          deposit={deposit}
          withdraw={withdraw}
        ></CollapseComponent>
      ) : (
        <BaseCollapse
          item={item}
          propActiveKey={propActiveKey}
          changeActiveKey={(key: any) => changeActiveKey(key, item)}
          isShowTitle={false}
          header={getPositionHeader(item)}
          content={getPositionContent(item)}
        ></BaseCollapse>
      )}
    </>
  )
}
