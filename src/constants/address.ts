import { SupportedChainId } from './chains'

type AddressMap = { [chainId: number]: string }

export const AddressZero = '0x0000000000000000000000000000000000000000'
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
  [SupportedChainId.BSCTEST]: '0x11cee792b8D394f90127C1d631842a4898A422a0',
  [SupportedChainId.BSC]: '',
}
export const TRANSACTION_OPERATABLE_ADDRESS: AddressMap = {
  [SupportedChainId.BSCTEST]: '0x15487E4f8f2064F29E559ec93b136a666f4CaB45',
  [SupportedChainId.BSC]: '',
}

export const TRANSACTION_MULTISEND_ADDRESS: AddressMap = {
  [SupportedChainId.BSCTEST]: '0x316D5a4728E53e657136f2c0bCE71a8fA56Bd419',
  [SupportedChainId.BSC]: '',
}

// TODO    transaction  address  end
