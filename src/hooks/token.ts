/*
 * @Author: jiangjin
 * @Date: 2021-09-18 18:22:21
 * @LastEditTime: 2021-09-23 18:35:50
 * @LastEditors: jiangjin
 * @Description:
 *
 */

import { Erc20Interface } from '@/abis/types/Erc20'
import { isAddress } from '@/utils'
import { Interface } from '@ethersproject/abi'
import { Token, CurrencyAmount } from '@/plugins/@uniswap/sdk-core'
import { useMemo } from 'react'
import JSBI from 'jsbi'

import ERC20ABI from '@/abis/erc20.json'
import { useMultipleContractSingleData } from '@/store/multicall/hooks'

import DEFAULT_TOKEN_LIST from '@/constants/default-tokens.json'
import { TokenList } from '@/plugins/@uniswap/token-lists/dist'
import { WrappedTokenInfo } from '@/types/wrappedTokenInfo'
import { useActiveWeb3React } from './web3'

/**
 * Returns a map of token addresses to their eventually consistent token balances for a single account.
 */
export function useTokenBalancesWithLoadingIndicator(
  address?: string,
  tokens?: (Token | undefined)[]
): [{ [tokenAddress: string]: CurrencyAmount<Token> | undefined }, boolean] {
  const validatedTokens: Token[] = useMemo(
    () => tokens?.filter((t?: Token): t is Token => isAddress(t?.address) !== false) ?? [],
    [tokens]
  )

  const validatedTokenAddresses = useMemo(() => validatedTokens.map((vt) => vt.address), [validatedTokens])
  const ERC20Interface = new Interface(ERC20ABI) as Erc20Interface
  const balances = useMultipleContractSingleData(
    validatedTokenAddresses,
    ERC20Interface,
    'balanceOf',
    [address],
    undefined,
    100_000
  )

  const anyLoading: boolean = useMemo(() => balances.some((callState) => callState.loading), [balances])

  return [
    useMemo(
      () =>
        address && validatedTokens.length > 0
          ? validatedTokens.reduce<{ [tokenAddress: string]: CurrencyAmount<Token> | undefined }>((memo, token, i) => {
              const value = balances?.[i]?.result?.[0]
              const amount = value ? JSBI.BigInt(value.toString()) : undefined
              if (amount) {
                memo[token.address] = CurrencyAmount.fromRawAmount(token, amount)
              }
              return memo
            }, {})
          : {},
      [address, validatedTokens, balances]
    ),
    anyLoading,
  ]
}

export function useTokenBalances(
  address?: string,
  tokens?: (Token | undefined)[]
): { [tokenAddress: string]: CurrencyAmount<Token> | undefined } {
  return useTokenBalancesWithLoadingIndicator(address, tokens)[0]
}

// get the balance for a single token/account combo
export function useTokenBalance(account?: string, token?: Token): CurrencyAmount<Token> | undefined {
  const tokenBalances = useTokenBalances(account, [token])
  if (!token) return undefined
  return tokenBalances[token.address]
}

interface TokenAddressMap {
  [chainId: number]: Readonly<{ [tokenAddress: string]: WrappedTokenInfo }>
}

// 将混杂的tokens根据chainId区分开来
const cachedList = typeof WeakMap !== undefined ? new WeakMap<TokenList, TokenAddressMap>() : null
function listToTokenMap(list: TokenList) {
  let result = cachedList?.get(list)
  if (result) return result

  result = list.tokens.reduce<TokenAddressMap>((memo, noWrapToken) => {
    const token = new WrappedTokenInfo(noWrapToken, list)
    const chainId = token.chainId
    const address = token.address

    return {
      ...memo,
      [chainId]: {
        ...memo[chainId],
        [address]: token,
      },
    }
  }, {})

  cachedList?.set(list, result)
  return result
}

function useCombineTokenMap(map1: TokenAddressMap | undefined, map2: TokenAddressMap | undefined) {
  return useMemo(() => ({ ...map1, ...map2 }), [map1, map2])
}

export function useTokensFromMap(tokenMap: TokenAddressMap) {
  const { chainId } = useActiveWeb3React()

  return useMemo(() => (chainId ? tokenMap[chainId] : undefined), [chainId, tokenMap])
}

// 拿到当前chainId下的所有Tokens
export function useAllTokens() {
  const defaultTokenMap = listToTokenMap(DEFAULT_TOKEN_LIST)

  // TODO 如果要添加其他tokenlist，在此处整合进来
  // const combinedTokenMap = combineTokenMap()

  return useTokensFromMap(defaultTokenMap)
}

export function useToken(address: string | undefined) {
  const allTokens = useAllTokens()

  return useMemo(() => (address ? allTokens?.[address] : undefined), [address, allTokens])
}
