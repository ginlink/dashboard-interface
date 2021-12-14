import { constructSameAddressMap } from '@/utils/constructSameAddressMap'
import { SupportedChainId } from './chains'

export type AddressMap = { [chainId: number]: string }

export const AddressZero = '0x0000000000000000000000000000000000000000'

export function getAddress(address: string | AddressMap, chainId: number | undefined) {
  if (!chainId) return

  return typeof address == 'string' ? address : address ? address[chainId] : undefined
}

export const MULTICALL_ADDRESSES: AddressMap | string = {
  // [SupportedChainId.BSCTEST]: '0xC4eB70E1C4C1d866fb4f1Be73AA458dCDe9a1F99',
  [SupportedChainId.BSCTEST]: '0x11cee792b8D394f90127C1d631842a4898A422a0',
  [SupportedChainId.BSC]: '0x193869c927F2e416E71c3D178266cD2faf7ca2d0',
}

// TODO    transaction  address  start
export const TRANSACTION_SWAPMING_ADDRESSES: AddressMap = {
  [SupportedChainId.BSCTEST]: '0x77335A40e7e6b6898fF2523D0358fEB687252963',
  [SupportedChainId.BSC]: '',
}

export const TRANSACTION_POSITION_REWARD_ADDRESS: AddressMap = {
  [SupportedChainId.BSCTEST]: '0x77b9Ca1736B9Eab7CBb445e62efBf962085CC92c',
  [SupportedChainId.BSC]: '',
}

export const TRANSACTION_PROXY_ADDRESS: AddressMap = {
  // [SupportedChainId.BSCTEST]: '0xa417D727268ADb2A4FE137F47bf6AA493D2fAAd5',
  [SupportedChainId.BSCTEST]: '0x3c62EfcaAB9AB947219D1191C9CD157d1A6ebEF8',
  [SupportedChainId.BSC]: '',
}
export const TRANSACTION_OPERATABLE_ADDRESS: AddressMap = {
  // [SupportedChainId.BSCTEST]: '0x15487E4f8f2064F29E559ec93b136a666f4CaB45',
  [SupportedChainId.BSCTEST]: '0x15487E4f8f2064F29E559ec93b136a666f4CaB45',
  [SupportedChainId.BSC]: '',
}

export const TRANSACTION_MULTISEND_ADDRESS: AddressMap = {
  [SupportedChainId.BSCTEST]: '0x991E66338Aaa5E7BF3B4d21518fBDC0A8230d0c7',
  // [SupportedChainId.BSCTEST]: '0xdEF572641Fac47F770596357bfb7432F78407ab3',
  [SupportedChainId.BSC]: '',
}

export const TRANSACTION_ROUTER_ADDRESS: AddressMap = {
  [SupportedChainId.BSCTEST]: '0xD4f9e77C09627986aC86243E89b0E4401264430D',
  [SupportedChainId.BSC]: '',
}

// TODO    transaction  address  end

export const UNI_ADDRESS: AddressMap = constructSameAddressMap('0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', false)

export const SAFE_FACTORY_ADDRESS: AddressMap = {
  // [SupportedChainId.BSCTEST]: '0xDca1d403fC404F418e4038f00F75dCB1194E1E5a',
  [SupportedChainId.BSCTEST]: '0x28D301F911202F4C366182E5B7f097C582A3ed03',
  [SupportedChainId.BSC]: '',
}
