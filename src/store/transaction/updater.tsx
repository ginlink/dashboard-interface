/*
 * @Author: jiangjin
 * @Date: 2021-09-09 18:59:59
 * @LastEditTime: 2021-09-17 14:44:30
 * @LastEditors: jiangjin
 * @Description:
 *  Application轮询数据
 */

import { useBlockNumber } from '@/hooks/useBlockNumber'
import { useActiveWeb3React } from '@/hooks/web3'
import { retry, RetryableError, RetryOptions } from '@/utils/retry'
import { memo, useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { updateBlockNumberAction } from '../application/action'
import { useAddPopup } from '../application/hooks'
import { useAllTransactions } from './hooks'
import { FinalizeTransactionAction, updateTransactionAction } from './reducer'

/**
 * 首先，轮询什么内容？
 *   查询该笔交易是否成功（receipt）
 */
interface TxInterface {
  addedTime: number
  receipt?: Record<string, any>
  lastCheckedBlockNumber?: number
}

export function shouldCheck(lastBlockNumber: number, tx: TxInterface): boolean {
  if (tx.receipt) return false
  if (!tx.lastCheckedBlockNumber) return true
  const blocksSinceCheck = lastBlockNumber - tx.lastCheckedBlockNumber
  if (blocksSinceCheck < 1) return false
  const minutesPending = (new Date().getTime() - tx.addedTime) / 1000 / 60
  if (minutesPending > 60) {
    // 每一个小时，且块间距超过了10个就检查一次
    // every 10 blocks if pending for longer than an hour
    return blocksSinceCheck > 9
  } else if (minutesPending > 5) {
    // 每5分钟，且块间距超过了3个检查一次
    // every 3 blocks if pending more than 5 minutes
    return blocksSinceCheck > 2
  } else {
    // otherwise every block
    return true
  }
}

// 重试的option
const DEFAULT_RETRY_OPTIONS: RetryOptions = { n: 3, minWait: 1000, maxWait: 3000 }

function TransactionUpdater() {
  const { library, chainId } = useActiveWeb3React()
  const transactions = useAllTransactions()
  const latestBlockNumber = useBlockNumber()
  const dispatch = useDispatch()

  const addPopup = useAddPopup()

  const getReceipt = useCallback(
    (hash: string) => {
      if (!library) throw Error('no library')

      return retry(
        () =>
          library.getTransactionReceipt(hash).then((receipt) => {
            if (receipt == null) {
              throw new RetryableError('retry receipt')
            } else {
              return receipt
            }
          }),
        DEFAULT_RETRY_OPTIONS
      )
    },
    [library]
  )
  useEffect(() => {
    if (!chainId) return

    const cancels = Object.keys(transactions)
      .filter((hash) => shouldCheck(latestBlockNumber, transactions[hash]))
      .map((hash) => {
        const { promise, cancel } = getReceipt(hash)

        promise
          .then((receipt) => {
            if (receipt) {
              // 更新receipt
              // 更新UI（popup）
              // 更新blockNumbmer

              console.debug('[fetch receipt](更新transaction完毕):', hash)

              dispatch(FinalizeTransactionAction({ chainId, hash, receipt }))

              const { summary } = transactions[hash]
              addPopup({ tx: { hash, success: receipt.status === 1, summary } })

              // 如果获取的凭证大于最新number，则用最新的number
              // 始终保持最新block
              if (receipt.blockNumber > latestBlockNumber) {
                dispatch(updateBlockNumberAction(chainId, receipt.blockNumber))
              }
            } else {
              dispatch(updateTransactionAction({ chainId, hash, blockNumber: latestBlockNumber }))
            }
          })
          .catch((err) => {
            console.debug('[fetch receipt](error):', `${hash}-${err}`)
          })

        return cancel
      })

    return () => {
      // 有依赖变化，或者UI变化的时候清除所有任务
      cancels.forEach((cancel) => cancel())

      console.debug('[fetch receipt](清除所有transaction任务):')
    }
  }, [addPopup, chainId, dispatch, getReceipt, latestBlockNumber, transactions])

  return null
}

export default memo(TransactionUpdater)
