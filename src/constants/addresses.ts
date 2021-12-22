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
  [SupportedChainId.BSC]: '0xE6378DB95c737a2dFE8D34d360d386d815A564F7',
}

// TODO    transaction  address  start
export const TRANSACTION_SWAPMING_ADDRESSES: AddressMap = {
  [SupportedChainId.BSCTEST]: '0xB8a8AE24916b23F7210C0DB52859AB1C1C57A876',
  [SupportedChainId.BSC]: '0x58469aee3436A000698D0a8e648f5d14F31eE019',
}

export const TRANSACTION_POSITION_REWARD_ADDRESS: AddressMap = {
  [SupportedChainId.BSCTEST]: '0xaA860a57490fF900081118E51a70630fb331525D',
  [SupportedChainId.BSC]: '0x8D6aa4D0cec1B49A1f738A7C6Ebd7C1AaAfAfC34',
}

export const TRANSACTION_PROXY_ADDRESS: AddressMap = {
  [SupportedChainId.BSCTEST]: '0x9574bdc63DD214903eB0BC268494F7B3A97D3340',
  // [SupportedChainId.BSCTEST]: '0x3c62EfcaAB9AB947219D1191C9CD157d1A6ebEF8',
  [SupportedChainId.BSC]: '0x89c00589EC5B5547Ae8Ea1A5f4b41867635123a5',
}
export const TRANSACTION_OPERATABLE_ADDRESS: AddressMap = {
  // [SupportedChainId.BSCTEST]: '0x15487E4f8f2064F29E559ec93b136a666f4CaB45',
  [SupportedChainId.BSCTEST]: '0x15487E4f8f2064F29E559ec93b136a666f4CaB45',
  [SupportedChainId.BSC]: '0xC683562B5138C721D179dD391C21E9e5BB6808dA',
}

export const TRANSACTION_MULTISEND_ADDRESS: AddressMap = {
  [SupportedChainId.BSCTEST]: '0x3dBaEe216aC375D0247490c702cD5A8565cb2B20',
  // [SupportedChainId.BSCTEST]: '0xdEF572641Fac47F770596357bfb7432F78407ab3',
  [SupportedChainId.BSC]: '0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761',
}

export const TRANSACTION_ROUTER_ADDRESS: AddressMap = {
  [SupportedChainId.BSCTEST]: '0xD4f9e77C09627986aC86243E89b0E4401264430D',
  [SupportedChainId.BSC]: '0xcD87782A717F40542e18C61Ebb7210d3132e17d8',
}

// TODO    transaction  address  end

export const UNI_ADDRESS: AddressMap = constructSameAddressMap('0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', false)

export const SAFE_FACTORY_ADDRESS: AddressMap = {
  // [SupportedChainId.BSCTEST]: '0xDca1d403fC404F418e4038f00F75dCB1194E1E5a',
  [SupportedChainId.BSCTEST]: '0x28D301F911202F4C366182E5B7f097C582A3ed03',
  [SupportedChainId.BSC]: '0x571521f8c16f3c4eD5f2490f19187bA7A5A3CBDf',
}
