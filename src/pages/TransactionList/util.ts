import { MultiSend } from '@/abis/types'
import { TxPropsApi, TxStatusEnum } from '@/services/api'
import {
  buildContractCall,
  buildSafeTransaction,
  buildSignatureBytes,
  calculateSafeTransactionHash,
  SafeSignature,
  SafeTransaction,
  signer,
} from '@/utils/execution'
import { buildMultiSendSafeTx } from '@/utils/multisend'
import { Contract } from 'ethers'
import { SafeProxyInfo } from '.'
import { FuncType, ParsedFunc } from '../CallAdmin/util'
import { CallType } from './CreateTransactionModal'

export type StaticBaseAbi = {
  inputs?: {
    name?: string
    type?: string
  }[]
  name?: string
  type?: string
  stateMutability?: 'view' | 'other'

  [key: string]: any
}

export function parseFuncs(abi?: StaticBaseAbi[]): ParsedFunc[] | undefined {
  if (!abi) return

  const realAbi = abi.filter((item) => item.type === 'function')

  return realAbi.map((item) => {
    const { name, inputs, stateMutability } = item

    // const paramLen = inputs.length

    const param = inputs
      ?.map((param) => {
        const { type, name: paramName } = param

        return `${type} ${paramName}`
      })
      ?.join(',')

    const isView = stateMutability && stateMutability === 'view'

    return {
      name,
      // params: paramLen ? params : undefined,
      param,
      nameAndParam: `${name}(${param})`,

      type: isView ? FuncType.READ : FuncType.WRITE,
    }
  })
}

const startSquareBracketsReg = /^\[.*?\]/

export function parseParam(arg?: string) {
  // ["0x07BdAA598FC89BC304F9942178c0fF9592A8Df16","100,0x716A55613218a6c7814a1aDCD4575a4397Db352B","1639377600"],100

  if (!arg) return

  // not include []
  if (!/\[/.test(arg)) {
    return arg.split(',')
  }

  // prepare
  arg = arg.trim()

  let pos = 0
  const param: string[] = []
  const len = arg.length

  while (pos < len) {
    const currentStr = arg.slice(pos)

    const matched = currentStr.match(startSquareBracketsReg)
    if (matched) {
      const matchedStr = matched[0]

      const parsed = JSON.parse(matchedStr)

      // matchedStr = matchedStr.replaceAll('\\', '')

      console.log('[](matchedStr):', matchedStr)

      debugger
      const matchedLen = matchedStr.length
      // param.push(matchedStr)
      param.push(parsed)

      pos += matchedLen
      ++pos //jump comma
    } else {
      const commaPos = currentStr.indexOf(',')

      const normalStr = commaPos != -1 ? currentStr.slice(0, commaPos) : currentStr.slice(0)
      const normalStrLen = normalStr.length
      param.push(normalStr)

      pos += normalStrLen
      ++pos //jump comma
    }
  }

  return param
}

// console.log(
//   '[](parseParam):',
//   parseParam(
//     '["0x07BdAA598FC89BC304F9942178c0fF9592A8Df16","100,0x716A55613218a6c7814a1aDCD4575a4397Db352B","1639377600"],100'
//   )
// )

export type StaticBaseContract = {
  contractName?: string
  abi?: StaticBaseAbi[]
}

/**
 *
 * {
 *  ['swapContract']: {
 *    funcs: [
 *      {
 *        name: 'balanceOf',
 *        param: 'address account, address xxx',
 *        origin: '',
 *      }
 *    ]
 *  }
 * }
 */

// export function parseFunc2(abis: StaticBaseAbi[] | undefined): ParsedFuc[] | undefined {
//   if (!abis) return
// }

export type ParsedContract = {
  [key: string]: {
    funcs?: ParsedFunc[]
    abi: any
  }
}

export type ContractAddresses = {
  [key: string]: string
}

export function parseAbis(staticContract?: StaticBaseContract[]): ParsedContract | undefined {
  if (!staticContract) return

  return staticContract.reduce<ParsedContract>((memo, item): ParsedContract => {
    const { contractName, abi } = item

    if (!contractName) return memo

    memo[contractName] = {
      funcs: parseFuncs(abi),
      abi: abi,
    }

    return memo
  }, {})

  // return staticContract.reduce((memo, item) => {
  //   const { contractName, abi } = item

  //   memo[contractName] = {
  //     funcs:
  //   }

  //   // if (!contractName) return

  // }, {})
}

export type BundleCallDataProps = {
  type?: CallType
  contract?: any
  multiSendContract?: MultiSend
  safe?: Contract
  method?: string
  params?: string[]
  nonce?: number
  chainId?: number | undefined
}

export function bundleCallData({
  type,
  contract,
  multiSendContract,
  safe,
  method,
  params,
  nonce,
  chainId,
}: BundleCallDataProps): [SafeTransaction | undefined, string | undefined] {
  debugger

  if (nonce === undefined) return [undefined, undefined]

  if (!contract || !multiSendContract || !safe || !method || !params || !chainId) return [undefined, undefined]

  let txs: SafeTransaction[] | undefined = undefined

  switch (type) {
    case CallType.TRANSFER:
      const data = contract.interface.encodeFunctionData('transfer', params)

      txs = [buildSafeTransaction({ to: contract.address, data, safeTxGas: 1000000, nonce: nonce })]
      break

    case CallType.METHOD:
      txs = [buildContractCall(contract, method, params, nonce)]
      break

    default:
      break
  }

  if (!txs) return [undefined, undefined]

  const safeTx = buildMultiSendSafeTx(multiSendContract, txs, nonce)

  const safeApproveHash = calculateSafeTransactionHash(safe, safeTx, chainId)

  return [safeTx, safeApproveHash]
}

export function getExecByteData() {
  // TODO注意更新owner
  const owner = [
    // '0x0F70D0661bA51a0383f59E76dC0f2d44703A8680',
    // '0xD06803c7cE034098CB332Af4C647f293C8BcD76a',
    // '0xf0a734400c8BD2e80Ba166940B904C59Dd08b6F0',
    '0xBf992941F09310b53A9F3436b0F40B25bCcc2C33',
    '0x6E6154b3ea29a4B4d85404B4e259661eBa81Dd67',
  ]

  const ownerBty32 = owner.map((item) => signer(item))

  return buildSignatureBytes(ownerBty32)
}

export function isMeet(stable?: string[], target?: string[], num?: number) {
  if (!stable || !target || !num) return false

  const len0 = stable.length
  const len1 = target.length

  let counter = 0
  for (let i = 0; i < len0; ++i) {
    const a = stable[i]

    for (let j = 0; j < len1; ++j) {
      const b = target[j]

      if (a.toLowerCase() == b.toLowerCase()) {
        ++counter
      }

      if (counter >= num) return true
    }
  }

  return false
}

export type NonceAdapterProps = {
  data?: TxPropsApi[]
  nonce?: number
  safeProxyInfo?: SafeProxyInfo
}

export function nonceAdapter({ data, nonce: offsetNonce, safeProxyInfo }: NonceAdapterProps) {
  if (!data || !TxStatusEnum || !offsetNonce || !safeProxyInfo) return
  if (offsetNonce === undefined) return

  return data.map((item) => {
    const { txId: txIdString, txSingal } = item

    let status = TxStatusEnum.UNKNOWN

    if (!txIdString) return { ...item, txStatus: status }

    const txId = parseInt(txIdString)

    // illegal
    if (txId > offsetNonce) {
      return {
        ...item,
        txStatus: status,
      }
    }

    let signatures: SafeSignature[] | undefined = undefined
    try {
      signatures = txSingal ? JSON.parse(txSingal) : undefined
    } catch (err) {
      console.log('[](err):', err)
    }

    const { owners, threshold } = safeProxyInfo

    if (txId < offsetNonce) {
      status = TxStatusEnum.FAILED
    }

    if (owners && signatures && threshold) {
      if (
        isMeet(
          owners,
          signatures.map((item) => item.signer),
          threshold
        )
      ) {
        status = TxStatusEnum.SUCCESS
      }
    }

    if (txId == offsetNonce) {
      status = TxStatusEnum.LOADING
    }

    return {
      ...item,
      txStatus: status,
    }
  })
}
