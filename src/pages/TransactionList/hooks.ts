import { BigNumberish, Contract } from 'ethers'
import {
  buildContractCall,
  buildSafeTransaction,
  buildSignatureBytes,
  calculateSafeTransactionHash,
  signer,
} from '@/utils/execution'
import { buildMultiSendSafeTx } from '@/utils/multisend'
import { useTransactionMultiSend, useTransactionProxy } from '@/hooks/useContract'
import { useEffect, useMemo, useState } from 'react'

export enum TYPESTATE {
  TRANSFER = 1,
  METHOD = 2,
}
export enum TXSTATE {
  COMPLETED = 1,
  HAVEINHAND = 2,
  INVALID = 3,
}
export const APPROVENUM = 2
export const OWNERARR: Array<string> = [
  '0x0F70D0661bA51a0383f59E76dC0f2d44703A8680',
  '0xD06803c7cE034098CB332Af4C647f293C8BcD76a',
  '0xf0a734400c8BD2e80Ba166940B904C59Dd08b6F0',
  '0xBf992941F09310b53A9F3436b0F40B25bCcc2C33',
]

import { Erc20 } from '@/abis/types'
import { useSingleCallResult } from '@/state/multicall/hooks'
import { TxPropsApi } from '@/services/api'

export type TransactionSubmitProps = {
  contract?: any
  safe?: Contract
  method?: string
  params?: [string, BigNumberish] | undefined
  nonce?: number
  chainId?: number | undefined
  fnType?: TYPESTATE
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
    if (!contract || !method || !params || nonce === undefined || !fnType) return null

    if (fnType == TYPESTATE.TRANSFER) {
      const data = contract.interface.encodeFunctionData('transfer', params)
      return [buildSafeTransaction({ to: contract.address, data, safeTxGas: 1000000, nonce: nonce })]
    } else if (fnType == TYPESTATE.METHOD) {
      return [buildContractCall(contract, method, params, 0)]
    }
  }, [contract, fnType, method, nonce, params])

  const safeTx = useMemo(() => {
    if (!multiSend || !txs || nonce === undefined) return null
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

//事务状态处理
export function useTxStatus(record: TxPropsApi) {
  const transactionProxy = useTransactionProxy()
  const [currentApproveNum, setCurrentApproveNum] = useState<number>(0)

  const { result } = useSingleCallResult(transactionProxy, 'nonce')

  const nonce = useMemo(() => {
    if (!result) return
    return result[0].toNumber()
  }, [result])

  useEffect(() => {
    if (!transactionProxy) return
    if (!record) return
    // const promiseArr: Array<any> = []
    // OWNERARR.map((v: string) => {
    //   promiseArr.push(transactionProxy?.approvedHashes(v, record.txHash))
    // })
    // Promise.all(promiseArr).then((res) => {
    //   let count = 0
    //   res.map((v) => {
    //     if (v.toNumber()) count += 1
    //   })
    //   setCurrentApproveNum(count)
    // })
  }, [nonce, record, transactionProxy])

  return useMemo(() => {
    if (!nonce) {
      return '--'
    }

    if (currentApproveNum >= APPROVENUM && nonce > Number(record.txId)) {
      return '已完成'
    }

    if (currentApproveNum >= 0 && nonce == Number(record.txId)) {
      return '进行中'
    }

    return '已失效'
  }, [currentApproveNum, nonce, record.txId])
}
