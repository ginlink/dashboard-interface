import { MultiSend } from '@/abis/types'
import {
  buildContractCall,
  buildSafeTransaction,
  buildSignatureBytes,
  calculateSafeTransactionHash,
  SafeTransaction,
  signer,
} from '@/utils/execution'
import { buildMultiSendSafeTx } from '@/utils/multisend'
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
  safeAddress?: string
  method?: string
  params?: string[]
  nonce?: number
  chainId?: number | undefined
}

export function bundleCallData({
  type,
  contract,
  multiSendContract,
  safeAddress,
  method,
  params,
  nonce,
  chainId,
}: BundleCallDataProps): [SafeTransaction | undefined, string | undefined] {
  if (nonce === undefined) return [undefined, undefined]

  if (!contract || !multiSendContract || !safeAddress || !method || !params || !chainId) return [undefined, undefined]

  let txs: SafeTransaction[] | undefined = undefined

  switch (type) {
    case CallType.TRANSFER:
      const data = contract.interface.encodeFunctionData('transfer', params)

      txs = [buildSafeTransaction({ to: contract.address, data, safeTxGas: 1000000, nonce: nonce })]
      break

    case CallType.TRANSFER:
      txs = [buildContractCall(contract, method, params, 0)]
      break

    default:
      break
  }

  if (!txs) return [undefined, undefined]

  const safeTx = buildMultiSendSafeTx(multiSendContract, txs, nonce)

  const safeApproveHash = calculateSafeTransactionHash(safeAddress, safeTx, chainId)

  return [safeTx, safeApproveHash]
}

export function getExecByteData() {
  // TODO注意更新owner
  const owner = [
    '0x0F70D0661bA51a0383f59E76dC0f2d44703A8680',
    '0xD06803c7cE034098CB332Af4C647f293C8BcD76a',
    '0xf0a734400c8BD2e80Ba166940B904C59Dd08b6F0',
    '0xBf992941F09310b53A9F3436b0F40B25bCcc2C33',
  ]

  const ownerBty32 = owner.map((item) => signer(item))

  return buildSignatureBytes(ownerBty32)
}
