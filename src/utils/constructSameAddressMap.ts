import { SupportedChainId } from '../constants/chains'

export function constructSameAddressMap<T extends string>(
  address: T,
  includeArbitrum: boolean
): { [chainId: number]: T } {
  if (includeArbitrum)
    return {
      [SupportedChainId.BSCTEST]: address,
      [SupportedChainId.BSC]: address,
    }
  return {
    [SupportedChainId.BSCTEST]: address,
    [SupportedChainId.BSC]: address,
  }
}
