import React, { useCallback, useMemo, useState } from 'react'

import { HTTP_POLL_DELAY, HTTP_QUEUEQUERY_DELAY } from 'constants/misc'
import useInterval from '@/hooks/useInterval'
import { useQueryTransactionList } from './hooks'

export default function Updater(): null {
  const [, setTimes] = useState<number>(0)

  const queryTransactionList = useQueryTransactionList()

  const queryQueue = useMemo((): any[] => {
    const queue = []
    queue.push(queryTransactionList)
    return queue
    // return []
  }, [queryTransactionList])

  const queryDataHandler = useCallback(() => {
    setTimes((prev: number) => {
      return ++prev
    })

    // 队列元素请求间隔，默认500ms
    const len = queryQueue.length
    for (let i = 0; i < len; ++i) {
      if (!queryQueue || typeof queryQueue[i] != 'function') continue

      setTimeout(() => {
        queryQueue[i]()
      }, HTTP_QUEUEQUERY_DELAY * (i + 1))
    }
  }, [queryQueue])

  useInterval(queryDataHandler, HTTP_POLL_DELAY, true)

  return null
}
