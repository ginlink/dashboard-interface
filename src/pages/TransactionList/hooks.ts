import { Contract, BigNumberish } from 'ethers'

import {
  buildContractCall,
  buildSafeTransaction,
  buildSignatureBytes,
  calculateSafeTransactionHash,
  signer,
} from '@/utils/execution'
import { buildMultiSendSafeTx } from '@/utils/multisend'
import { useTransactionMultiSend } from '@/hooks/useContract'
import { useMemo } from 'react'

export function useTransacitonSubmitData(
  contract: any | null,
  method: string,
  params: any[],
  nonce: number,
  chainId: string,
  safe: string
) {
  const multiSend = useTransactionMultiSend()
  // const txs = useMemo(() => {
  //   if (!contract || !method || !params) return null
  //   return [buildContractCall(contract, method, params, 0)]
  // }, [contract, method, params])
  const txs = useMemo(() => {
    if (!contract || !method || !params) return null
    const data = contract.interface.encodeFunctionData('transfer', params)
    console.log(data)
    console.log('contract.address', contract.address)
    return [buildSafeTransaction({ to: contract.address, data, safeTxGas: 1000000, nonce: nonce })]
  }, [contract, method, nonce, params])
  const safeTx = useMemo(() => {
    if (!multiSend || !txs) return null
    return buildMultiSendSafeTx(multiSend, txs, nonce)
  }, [multiSend, nonce, txs])

  const safeApproveHash = useMemo(() => {
    if (!safeTx) return null
    return calculateSafeTransactionHash(safe, safeTx, chainId)
  }, [chainId, safe, safeTx])

  return {
    safeTx,
    safeApproveHash,
  }
}

export function useSignatureBytes(owner: any[]) {
  return useMemo(() => {
    const ownerBty32 = owner.map((item) => signer(item))
    return buildSignatureBytes(ownerBty32)
  }, [owner])
}
