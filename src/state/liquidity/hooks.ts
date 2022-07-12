import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from 'state/hooks'
import { AppState } from '../index'
import { updateKeyString } from './actions'

export function useKeyUpString(): string {
  return useAppSelector((state: AppState) => state.liquidity.keyUpString)
}

export function useUpdateKeyString() {
  const dispatch = useAppDispatch()

  return useCallback(
    (keyUpString: string) => {
      dispatch(updateKeyString({ keyUpString }))
    },
    [dispatch]
  )
}
