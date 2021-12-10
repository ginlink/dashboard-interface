import { parseBytes32String } from '@ethersproject/strings'
import { Currency, Token } from 'plugins/@uniswap/sdk-core'
import { arrayify } from 'ethers/lib/utils'
import { useMemo } from 'react'
import { ExtendedEther, WETH9_EXTENDED } from '../constants/tokens'
import { NEVER_RELOAD, useSingleCallResult } from '../state/multicall/hooks'
import { isAddress } from '../utils'
import { TokenAddressMap, useUnsupportedTokenList } from './../state/lists/hooks'
import { useActiveWeb3React } from './web3'
import { useBytes32TokenContract, useTokenContract } from './useContract'
import { useCombinedActiveList } from '../state/lists/hooks'
// reduce token map into standard address <-> Token mapping, optionally include user added tokens
// reduce token map into standard address <-> Token mapping, optionally include user added tokens
function useTokensFromMap(tokenMap: TokenAddressMap, includeUserAdded: boolean): { [address: string]: Token } {
  const { chainId } = useActiveWeb3React()
  return useMemo(() => {
    if (!chainId) return {}

    // reduce to just tokens
    const mapWithoutUrls = Object.keys(tokenMap[chainId] ?? {}).reduce<{ [address: string]: Token }>(
      (newMap, address) => {
        newMap[address] = tokenMap[chainId][address].token
        return newMap
      },
      {}
    )

    return mapWithoutUrls
  }, [chainId, tokenMap])
}

export function useAllTokens(): { [address: string]: Token } {
  const allTokens = useCombinedActiveList()
  // return useTokensFromMap(allTokens, true)
  return useTokensFromMap(allTokens, false)
}

export function useUnsupportedTokens(): { [address: string]: Token } {
  const unsupportedTokensMap = useUnsupportedTokenList()
  return useTokensFromMap(unsupportedTokensMap, false)
}

export function useIsTokenActive(token: Token | undefined | null): boolean {
  const activeTokens = useAllTokens()

  if (!activeTokens || !token) {
    return false
  }

  return !!activeTokens[token.address]
}

// parse a name or symbol from a token response
const BYTES32_REGEX = /^0x[a-fA-F0-9]{64}$/

function parseStringOrBytes32(str: string | undefined, bytes32: string | undefined, defaultValue: string): string {
  return str && str.length > 0
    ? str
    : // need to check for proper bytes string and valid terminator
    bytes32 && BYTES32_REGEX.test(bytes32) && arrayify(bytes32)[31] === 0
    ? parseBytes32String(bytes32)
    : defaultValue
}

// undefined if invalid or does not exist
// null if loading
// otherwise returns the token
export function useToken(tokenAddress?: string): Token | undefined | null {
  const { chainId } = useActiveWeb3React()
  // const tokens = useAllTokens()

  const address = isAddress(tokenAddress)

  const tokenContract = useTokenContract(address ? address : undefined)
  const tokenContractBytes32 = useBytes32TokenContract(address ? address : undefined, false)

  // const token: Token | undefined = address ? tokens[address] : undefined

  const tokenName = useSingleCallResult(tokenContract, 'name', undefined, NEVER_RELOAD)
  const tokenNameBytes32 = useSingleCallResult(tokenContractBytes32, 'name', undefined, NEVER_RELOAD)

  const symbol = useSingleCallResult(tokenContract, 'symbol', undefined, NEVER_RELOAD)
  const symbolBytes32 = useSingleCallResult(tokenContractBytes32, 'symbol', undefined, NEVER_RELOAD)
  const decimals = useSingleCallResult(tokenContract, 'decimals', undefined, NEVER_RELOAD)

  return useMemo(() => {
    if (!chainId || !address) return undefined
    if (decimals.loading || symbol.loading || tokenName.loading) return null
    if (decimals.result) {
      return new Token(
        chainId,
        address,
        decimals.result[0],
        parseStringOrBytes32(symbol.result?.[0], symbolBytes32.result?.[0], 'UNKNOWN'),
        parseStringOrBytes32(tokenName.result?.[0], tokenNameBytes32.result?.[0], 'Unknown Token')
      )
    }
    return undefined
  }, [
    address,
    chainId,
    decimals.loading,
    decimals.result,
    symbol.loading,
    symbol.result,
    symbolBytes32.result,
    tokenName.loading,
    tokenName.result,
    tokenNameBytes32.result,
  ])
}

/**
 * 注意：由于底层写死了Eth，所以通过currencyId===WBNB时，外层内容为ETH
 * ，但包裹内容为BNB
 *  function Ether(chainId) {
      return _NativeCurrency.call(this, chainId, 18, 'BNB', 'BNB') || this;
    }
 * @param currencyId 
 * @returns 
 */
export function useCurrency(currencyId: string | undefined): Currency | null | undefined {
  const { chainId } = useActiveWeb3React()
  const isETH = currencyId?.toUpperCase() === 'BNB'

  const token = useToken(isETH ? undefined : currencyId)

  const extendedEther = useMemo(() => (chainId ? ExtendedEther.onChain(chainId) : undefined), [chainId])

  const weth = chainId ? WETH9_EXTENDED[chainId] : undefined

  if (weth?.address?.toLowerCase() === currencyId?.toLowerCase()) return weth

  return isETH ? extendedEther : token
}
