/*
 * @Author: jiangjin
 * @Date: 2021-09-12 20:56:09
 * @LastEditTime: 2021-09-14 15:12:24
 * @LastEditors: jiangjin
 * @Description:
 *  用于useSelector的第二个参数，节流用，依赖不变化，则不通知我更新
 */

import { EqualityFn } from '@/store/multicall/hooks'
import { useCallback } from 'react'
import { useActiveWeb3React } from './web3'

enum ChangedHandlerMode {
  ONLY_DATA,
  DATA_AND_BLOCKNUMBER,
}

function useChangedHandler(mode = ChangedHandlerMode.ONLY_DATA): EqualityFn {
  const { chainId } = useActiveWeb3React()

  return useCallback(
    (left, right) => {
      if (!chainId) return true

      // console.debug('[equalityFn](left, right):', left, right)

      const leftCallResultMap = left[chainId]
      const rightCallResultMap = right[chainId]

      if (!leftCallResultMap || !rightCallResultMap) return false

      const len1 = Object.keys(leftCallResultMap).length
      const len2 = Object.keys(rightCallResultMap).length

      if (len1 == 0 && len2 == 0) return true
      if (len1 != len2) return false

      // debugger
      // 333
      const isEqual: boolean[] = []
      Object.keys(leftCallResultMap).forEach((callKey: string) => {
        const { blockNumber: blockNumber1, data: data1 } = leftCallResultMap[callKey]
        const { blockNumber: blockNumber2, data: data2 } = rightCallResultMap[callKey]

        // 只关心数据
        if (mode === ChangedHandlerMode.ONLY_DATA) {
          // 我只考虑数据是否一致，如果数据一致，则不要通知我更新
          if (data1 == data2) {
            isEqual.push(true)
          }
        } else if (mode === ChangedHandlerMode.DATA_AND_BLOCKNUMBER) {
          if (blockNumber1 == blockNumber2 && data1 == data2) {
            isEqual.push(true)
          }
        }
      })

      return isEqual.length > 0 ? isEqual.every((bool) => bool) : false
    },
    [chainId, mode]
  )
}

// 只关心数据变化，不管blockNumber是否变化，一般都用这个 节流
export function useOnlyDataChangedUpdate(): EqualityFn {
  return useChangedHandler()
}

// 数据或者blockNumber都变化时通知我，则基本每次都会通知我，因为blockNumber一定会变化
export function useDataAndBlockChangedUpdate() {
  return useChangedHandler(ChangedHandlerMode.DATA_AND_BLOCKNUMBER)
}
