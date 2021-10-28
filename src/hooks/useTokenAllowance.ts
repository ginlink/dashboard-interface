/*
 * @Author: jiangjin
 * @Date: 2021-09-15 10:48:17
 * @LastEditTime: 2021-09-26 17:11:48
 * @LastEditors: jiangjin
 * @Description:
 *
 */
import { Contract } from '@ethersproject/contracts'
import { Token, CurrencyAmount } from 'plugins/@uniswap/sdk-core'
import { useMemo } from 'react'
import { useSingleCallResult } from '../store/multicall/hooks'
import { useTokenContract } from './useContract'

export function useTokenAllowance(token?: Token, owner?: string, spender?: string): CurrencyAmount<Token> | undefined {
  const contract = useTokenContract(token?.address, false)

  const inputs = useMemo(() => [owner, spender], [owner, spender])

  const allowance = useSingleCallResult(contract, 'allowance', inputs).result

  return useMemo(
    () => (token && allowance ? CurrencyAmount.fromRawAmount(token, allowance.toString()) : undefined),
    [token, allowance]
  )
}

export function useAllowance(contract: Contract | undefined, owner?: string, spender?: string): string | undefined {
  const inputs = useMemo(() => [owner, spender], [owner, spender])

  const allowance = useSingleCallResult(contract, 'allowance', inputs).result
  // debugger

  return useMemo(() => (contract && allowance ? allowance.toString() : undefined), [allowance, contract])
}
