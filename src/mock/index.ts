/*
 * @Author: jiangjin
 * @Date: 2021-09-26 10:51:46
 * @LastEditTime: 2021-09-27 15:50:30
 * @LastEditors: jiangjin
 * @Description:
 *
 */

import { farmData, setData, singleData } from './api'

export interface DataListBase {
  id: number
  token0: string | undefined
  token1?: string | undefined
  lp_pool?: string | undefined

  platform: string | undefined
  apr?: string | undefined
  total_tvl: string | undefined

  vault_address: string | undefined
  reward_pool: string | undefined
}

export interface FarmData extends DataListBase {
  token1: string | undefined
  lp_pool: string | undefined
}
export interface SetData extends DataListBase {
  lower_tick: string | undefined
  higher_tick: string | undefined
}

export type SingleData = DataListBase

export function getFarmList(ms = 1000): Promise<FarmData[]> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(farmData)
    }, ms)
  })
}

export function getSingleList(ms = 1000): Promise<SingleData[]> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(singleData)
    }, ms)
  })
}

export function getSetList(ms = 1000): Promise<SetData[]> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(setData)
    }, ms)
  })
}
