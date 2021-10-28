/*
 * @Author: jiangjin
 * @Date: 2021-09-15 10:58:11
 * @LastEditTime: 2021-09-15 16:11:26
 * @LastEditors: jiangjin
 * @Description:
 *
 */
import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../state'
import { addTransactionAction, TransactionDetail } from './reducer'
import { TransactionResponse } from '@ethersproject/providers'
import { useActiveWeb3React } from '@/hooks/web3'

export function useTransactionAdder(): (
  response: TransactionResponse,
  data?: {
    summary?: string
    approval?: { tokenAddress: string; spender: string }
    claim?: { recipient: string }
  }
) => void {
  const dispatch = useDispatch()
  const { chainId, account } = useActiveWeb3React()

  return useCallback(
    (
      response: TransactionResponse,
      {
        summary,
        approval,
        claim,
      }: { summary?: string; approval?: { tokenAddress: string; spender: string }; claim?: { recipient: string } } = {}
    ) => {
      if (!chainId || !account) return

      dispatch(addTransactionAction({ chainId, from: account, hash: response.hash, summary, approval, claim }))
    },
    [account, chainId, dispatch]
  )
}

export function useAllTransactions() {
  const { chainId } = useActiveWeb3React()

  const transactions = useSelector((state: RootState) => state.transaction)

  return useMemo(() => (chainId ? transactions[chainId] ?? {} : {}), [chainId, transactions])
}

export function useIsTransactionPending(hash?: string) {
  const transactions = useAllTransactions()

  return useMemo(() => {
    if (!hash || !transactions[hash]) return false

    return !transactions[hash].receipt
  }, [hash, transactions])
}

/**
 * Returns whether a transaction happened in the last day (86400 seconds * 1000 milliseconds / second)
 * @param tx to check for recency
 */
export function isTransactionRecent(tx: TransactionDetail): boolean {
  return new Date().getTime() - tx.addedTime < 86_400_000
}

// 当前币种是否正在被授权
export function useHasPendingApproval(tokenAddress: string | undefined, spender: string | undefined): boolean {
  const transactions = useAllTransactions()

  return useMemo(
    () =>
      typeof tokenAddress === 'string' &&
      typeof spender === 'string' &&
      Object.keys(transactions).some((hash) => {
        const tx = transactions[hash]
        if (!tx) return false

        if (tx.receipt) {
          // 已经有凭证
          return false
        } else {
          const approval = tx.approval

          return approval
            ? approval.spender === spender && approval.tokenAddress === tokenAddress && isTransactionRecent(tx)
            : false
        }
      }),
    [spender, tokenAddress, transactions]
  )
}
