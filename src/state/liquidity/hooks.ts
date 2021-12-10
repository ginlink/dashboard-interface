/*
 * @Author: jiangjin
 * @Date: 2021-10-11 15:15:15
 * @LastEditTime: 2021-10-25 18:56:52
 * @LastEditors: jiangjin
 * @Description:
 *
 */
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
