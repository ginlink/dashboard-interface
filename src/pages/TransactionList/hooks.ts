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
export enum TYPESTATE {
  TRANSFER = 1,
  METHOD = 2,
}
export function useTransacitonSubmitData(
  contract: any | null,
  method: string,
  params: any[],
  nonce: number,
  chainId: string,
  safe: string,
  fnType: number
) {
  const multiSend = useTransactionMultiSend()
  const txs = useMemo(() => {
    if (!contract || !method || !params) return null
    if (fnType == TYPESTATE.TRANSFER) {
      const data = contract.interface.encodeFunctionData('transfer', params)
      return [buildSafeTransaction({ to: contract.address, data, safeTxGas: 1000000, nonce: nonce })]
    } else if (fnType == TYPESTATE.METHOD) {
      return [buildContractCall(contract, method, params, 0)]
    }
  }, [contract, fnType, method, nonce, params])
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
