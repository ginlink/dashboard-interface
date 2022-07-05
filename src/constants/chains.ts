// TODO 应该将不支持的网络注释掉

export enum SupportedChainId {
  // MAINNET = 1,
  // ROPSTEN = 3,
  // RINKEBY = 4,
  // GOERLI = 5,
  // KOVAN = 42,
  // ARBITRUM_ONE = 42161,

  BSCTEST = 97,
  BSC = 56,
  KCC = 321,
  KCCTEST = 322,
}

export const NETWORK_LABELS: { [chainId in SupportedChainId | number]: string } = {
  // [SupportedChainId.MAINNET]: 'Mainnet',
  // [SupportedChainId.RINKEBY]: 'Rinkeby',
  // [SupportedChainId.ROPSTEN]: 'Ropsten',
  // [SupportedChainId.GOERLI]: 'Görli',
  // [SupportedChainId.KOVAN]: 'Kovan',
  // [SupportedChainId.ARBITRUM_ONE]: 'Arbitrum One',

  [SupportedChainId.BSCTEST]: 'BSCTEST',
  [SupportedChainId.BSC]: 'BSC',
  [SupportedChainId.KCC]: 'KCC',
  [SupportedChainId.KCCTEST]: 'KCCTEST',
}
