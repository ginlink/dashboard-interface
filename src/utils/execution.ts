import { Contract, Wallet, utils, BigNumber, BigNumberish, Signer, PopulatedTransaction } from 'ethers'
import { AddressZero } from '../constants/addresses'

export const EIP_DOMAIN = {
  EIP712Domain: [
    { type: 'uint256', name: 'chainId' },
    { type: 'address', name: 'verifyingContract' },
  ],
}

export const EIP712_SAFE_TX_TYPE = {
  SafeTx: [
    { type: 'address', name: 'to' },
    { type: 'uint256', name: 'value' },
    { type: 'bytes', name: 'data' },
    { type: 'uint8', name: 'operation' },
    { type: 'uint256', name: 'safeTxGas' },
    { type: 'uint256', name: 'baseGas' },
    { type: 'uint256', name: 'gasPrice' },
    { type: 'address', name: 'gasToken' },
    { type: 'address', name: 'refundReceiver' },
    { type: 'uint256', name: 'nonce' },
  ],
}
export interface MetaTransaction {
  to: string
  value: string | number | BigNumber
  data: string
  operation: number
}

export interface SafeTransaction extends MetaTransaction {
  safeTxGas: string | number
  baseGas: string | number
  gasPrice: string | number
  gasToken: string
  refundReceiver: string
  nonce: string | number
}

export interface SafeSignature {
  signer: string
  data: string
}

export const calculateSafeTransactionHash = (safe: string, safeTx: SafeTransaction, chainId: BigNumberish): string => {
  return utils._TypedDataEncoder.hash({ verifyingContract: safe, chainId }, EIP712_SAFE_TX_TYPE, safeTx)
}

export const buildSignatureBytes = (signatures: SafeSignature[]): string => {
  signatures.sort((left, right) => left.signer.toLowerCase().localeCompare(right.signer.toLowerCase()))

  let signatureBytes = '0x'
  for (const sig of signatures) {
    signatureBytes += sig.data.slice(2)
  }
  return signatureBytes
}

export const buildContractCall = (
  contract: Contract,
  method: string,
  params: any[],
  nonce: number,
  delegateCall?: boolean,
  overrides?: Partial<SafeTransaction>
): SafeTransaction => {
  const data = contract.interface.encodeFunctionData(method, params)
  return buildSafeTransaction(
    Object.assign(
      {
        to: contract.address,
        data,
        operation: delegateCall ? 1 : 0,
        nonce,
      },
      overrides
    )
  )
}
export const buildSafeTransaction = (template: {
  to: string
  value?: BigNumber | number | string
  data?: string
  operation?: number
  safeTxGas?: number | string
  baseGas?: number | string
  gasPrice?: number | string
  gasToken?: string
  refundReceiver?: string
  nonce: number
}): SafeTransaction => {
  return {
    to: template.to,
    value: template.value || 0,
    data: template.data || '0x',
    operation: template.operation || 0,
    safeTxGas: template.safeTxGas || 0,
    baseGas: template.baseGas || 0,
    gasPrice: template.gasPrice || 0,
    gasToken: template.gasToken || AddressZero,
    refundReceiver: template.refundReceiver || AddressZero,
    nonce: template.nonce,
  }
}

export const signer = (user: string) => {
  return {
    signer: user,
    data:
      '0x000000000000000000000000' +
      user.slice(2) +
      '0000000000000000000000000000000000000000000000000000000000000000' +
      '01',
  }

  // 伪造的签名
  // const signatures =
  //   '0x' +
  //   '000000000000000000000000' +
  //   user1.address.slice(2) +
  //   '0000000000000000000000000000000000000000000000000000000000000041' +
  //   '00' // r, s, v
}
