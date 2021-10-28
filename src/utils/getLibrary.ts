/*
 * @Author: your name
 * @Date: 2021-09-01 19:02:56
 * @LastEditTime: 2021-09-17 14:40:23
 * @LastEditors: jiangjin
 * @Description: In User Settings Edit
 * @FilePath: /converter-bsc-web/src/utils/getLibrary.ts
 */
import { Web3Provider } from '@ethersproject/providers'

// import { SupportedChainId } from '../constants/chains'

// const NETWORK_POLLING_INTERVALS: { [chainId: number]: number } = {
//   // [SupportedChainId.ARBITRUM_ONE]: 1_000,
//   [0]: 1_000,
// }

export default function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(
    provider,
    typeof provider.chainId === 'number'
      ? provider.chainId
      : typeof provider.chainId === 'string'
      ? parseInt(provider.chainId)
      : 'any'
  )

  // 以下代码在BSC中无用
  // library.pollingInterval = 15_000
  // library.detectNetwork().then((network) => {
  //   const networkPollingInterval = NETWORK_POLLING_INTERVALS[network.chainId]
  //   if (networkPollingInterval) {
  //     console.debug('Setting polling interval', networkPollingInterval)
  //     library.pollingInterval = networkPollingInterval
  //   }
  // })
  return library
}
