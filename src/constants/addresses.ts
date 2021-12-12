import { constructSameAddressMap } from '@/utils/constructSameAddressMap'
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
  // [SupportedChainId.BSCTEST]: '0xa417D727268ADb2A4FE137F47bf6AA493D2fAAd5',
  [SupportedChainId.BSCTEST]: '0x0aAAc50719653930246bFe2a19e15C0c21366265',
  [SupportedChainId.BSC]: '',
}
export const TRANSACTION_OPERATABLE_ADDRESS: AddressMap = {
  // [SupportedChainId.BSCTEST]: '0x15487E4f8f2064F29E559ec93b136a666f4CaB45',
  [SupportedChainId.BSCTEST]: '0x29D2bEd6E240e015E09E0d2eDEFA8A55A8799671',
  [SupportedChainId.BSC]: '',
}

export const TRANSACTION_MULTISEND_ADDRESS: AddressMap = {
  [SupportedChainId.BSCTEST]: '0xfe24978d776d60340A0B4A590c27C753c45bb217',
  // [SupportedChainId.BSCTEST]: '0xdEF572641Fac47F770596357bfb7432F78407ab3',
  [SupportedChainId.BSC]: '',
}

// TODO    transaction  address  end

export const UNI_ADDRESS: AddressMap = constructSameAddressMap('0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', false)

export const SAFE_FACTORY_ADDRESS: AddressMap = {
  // [SupportedChainId.BSCTEST]: '0xDca1d403fC404F418e4038f00F75dCB1194E1E5a',
  [SupportedChainId.BSCTEST]: '0x28D301F911202F4C366182E5B7f097C582A3ed03',
  [SupportedChainId.BSC]: '',
}
