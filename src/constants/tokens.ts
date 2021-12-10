import { Token, Ether } from 'plugins/@uniswap/sdk-core'
import { UNI_ADDRESS } from './addresses'
import { SupportedChainId } from './chains'

export const WETH9 = {
  [56]: new Token(56, '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c', 18, 'WBNB', 'WBNB Token'),
  [97]: new Token(97, '0xABbc0dB80d50e4175CEC6A0efd43994a00c19b5F', 18, 'WBNB', 'WBNB Token'),
}

export const BUSDT = new Token(56, '0xe9e7cea3dedca5984780bafc599bd69add087d56', 18, 'BUSD', 'Binance Pegged BUSD')
export const BUSDT2 = new Token(56, '0x55d398326f99059fF775485246999027B3197955', 18, 'USDT', 'Binance Pegged USDT')
export const BUSDC = new Token(56, '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', 18, 'USDC', 'Binance Pegged USD Coin')
export const BTCB = new Token(56, '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c', 18, 'BTCB', 'Binance Pegged Bitcoin')
export const ETH = new Token(56, '0x2170Ed0880ac9A755fd29B2688956BD959F933F8', 18, 'ETH', 'Binance Pegged ETH')
export const CAKE = new Token(56, '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82', 18, 'CAKE', 'PancakeSwap Token')

export const SPC_MAIN = new Token(56, '0xc67a54D5E08e59FB70DD29D81350C6Ff4562D544', 18, 'SPC', 'SPC Token')
//  bnb 97
export const USDT = new Token(97, '0xfC3516F0Cb6E8a8b5051d1834a2123c89C48326C', 18, 'BUSD', 'Binance Pegged USDT')
export const USDC = new Token(97, '0xDfbac81612C80F3391472ebDa3f5d66611df7309', 6, 'USDC', 'USD//C')

export const AMPL = new Token(1, '0xD46bA6D942050d489DBd938a2C909A5d5039A161', 9, 'AMPL', 'Ampleforth')
export const DAI = new Token(1, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'Dai Stablecoin')
export const WBTC = new Token(1, '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', 8, 'WBTC', 'Wrapped BTC')
export const SPC = new Token(97, '0x4552cd5095d90A22DF56F76Fe8E859E4b422f829', 18, 'SPC', 'Wrapped SPC')
export const FEI = new Token(1, '0x956F47F50A910163D8BF957Cf5846D573E7f87CA', 18, 'FEI', 'Fei USD')
export const TRIBE = new Token(1, '0xc7283b66Eb1EB5FB86327f08e1B5816b0720212B', 18, 'TRIBE', 'Tribe')
export const FRAX = new Token(1, '0x853d955aCEf822Db058eb8505911ED77F175b99e', 18, 'FRAX', 'Frax')
export const FXS = new Token(1, '0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0', 18, 'FXS', 'Frax Share')
export const renBTC = new Token(1, '0xEB4C2781e4ebA804CE9a9803C67d0893436bB27D', 8, 'renBTC', 'renBTC')
export const UMA = new Token(1, '0x04Fa0d235C4abf4BcF4787aF4CF447DE572eF828', 18, 'UMA', 'UMA Voting Token v1')
export const ETH2X_FLI = new Token(
  1,
  '0xAa6E8127831c9DE45ae56bB1b0d4D4Da6e5665BD',
  18,
  'ETH2x-FLI',
  'ETH 2x Flexible Leverage Index'
)
// Mirror Protocol compat.
export const UST = new Token(1, '0xa47c8bf37f92abed4a126bda807a7b7498661acd', 18, 'UST', 'Wrapped UST')
export const MIR = new Token(1, '0x09a3ecafa817268f77be1283176b946c4ff2e608', 18, 'MIR', 'Wrapped MIR')

export const UNI: { [chainId: number]: Token } = {
  [SupportedChainId.BSCTEST]: new Token(SupportedChainId.BSCTEST, UNI_ADDRESS[97], 18, 'UNI', 'Uniswap'),
  [SupportedChainId.BSC]: new Token(SupportedChainId.BSC, UNI_ADDRESS[56], 18, 'UNI', 'Uniswap'),
}

export const WETH9_EXTENDED: { [chainId: number]: Token } = {
  ...WETH9,
}

export class ExtendedEther extends Ether {
  public get wrapped(): Token {
    if (this.chainId in WETH9_EXTENDED) return WETH9_EXTENDED[this.chainId]
    throw new Error('Unsupported chain ID')
  }

  public static onChain(chainId: number): ExtendedEther {
    return new ExtendedEther(chainId)
  }
}

export const ICON_SIZE = 30
