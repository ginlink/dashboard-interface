/*
 * @Author: your name
 * @Date: 2021-08-30 19:39:13
 * @LastEditTime: 2021-09-01 22:39:50
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: /converter-bsc-web/src/react-app-env.d.ts
 */
/// <reference types="react-scripts" />

declare module '@metamask/jazzicon' {
  export default function (diameter: number, seed: number): HTMLElement
}

declare module 'fortmatic'

interface Window {
  ethereum?: {
    isMetaMask?: true
    on?: (...args: any[]) => void
    removeListener?: (...args: any[]) => void
    autoRefreshOnNetworkChange?: boolean
  }
  web3?: Record<string, unknown>
}

declare module 'content-hash' {
  declare function decode(x: string): string
  declare function getCodec(x: string): string
}

declare module 'multihashes' {
  declare function decode(buff: Uint8Array): { code: number; name: string; length: number; digest: Uint8Array }
  declare function toB58String(hash: Uint8Array): string
}
