import { BigNumberish } from 'ethers'

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

import { Erc20 } from '@/abis/types'

export type TransactionSubmitProps = {
  contract?: Erc20 | null
  safe?: string
  method?: string
  params?: [string, BigNumberish] | undefined
  nonce?: number
  chainId?: number | undefined
  fnType: TYPESTATE
}

export function useTransacitonSubmitData({
  contract,
  safe,
  method,
  params,
  nonce,
  chainId,
  fnType,
}: TransactionSubmitProps) {
  const multiSend = useTransactionMultiSend()

  // const txs = useMemo(() => {
  //   if (!contract || !method || !params) return null
  //   return [buildContractCall(contract, method, params, 0)]
  // }, [contract, method, params])

  const txs = useMemo(() => {
    if (!contract || !method || !params || !nonce) return null

    if (fnType == TYPESTATE.TRANSFER) {
      const data = contract.interface.encodeFunctionData('transfer', params)
      return [buildSafeTransaction({ to: contract.address, data, safeTxGas: 1000000, nonce: nonce })]
    } else if (fnType == TYPESTATE.METHOD) {
      return [buildContractCall(contract, method, params, 0)]
    }
  }, [contract, fnType, method, nonce, params])

  const safeTx = useMemo(() => {
    if (!multiSend || !txs || !nonce) return null
    return buildMultiSendSafeTx(multiSend, txs, nonce)
  }, [multiSend, nonce, txs])

  const safeApproveHash = useMemo(() => {
    if (!safeTx || !chainId || !safe) return null

    return calculateSafeTransactionHash(safe, safeTx, chainId + '')
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
