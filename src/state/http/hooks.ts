import { useCallback, useMemo } from 'react'
import { AppState } from 'state'
import { useAppSelector } from 'state/hooks'
import { shallowEqualArr } from '@/utils/shallowEqual'
import { useDispatch } from 'react-redux'
import { setTransactionList } from './actions'
import { getTransctionList } from '@/services/api'

export function useQueryTransactionList() {
  const dispatch = useDispatch()

  return useCallback(() => {
    return getTransctionList().then((data: any) => {
      dispatch(setTransactionList({ list: data }))
    })
  }, [dispatch])
}

export function useTransactionList(): AppState['http']['transactionList'] {
  const list = useAppSelector((state: AppState) => {
    return state.http.transactionList
  }, shallowEqualArr)

  return useMemo(() => list, [list])
}
