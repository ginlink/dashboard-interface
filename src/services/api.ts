/*
 * @Author: jiangjin
 * @Date: 2021-09-23 16:02:00
 * @LastEditTime: 2021-09-23 16:11:23
 * @LastEditors: jiangjin
 * @Description:
 *  统一管理接口
 */

import http from './index'
interface HttpResponse {
  code: number
  data: Array<any>
}
interface SearchParams {
  name?: string
  start_time?: string
  end_time?: string
}
type addTxType = {
  txType?: number
  txFrom?: string
  txTo?: string
  txAmount?: any
  txHash?: string
  txFun?: string
  txFunArg?: string
}

export const getTableLists = (searchParams: SearchParams): Promise<HttpResponse> => {
  return http.post('/record/search', searchParams) as Promise<HttpResponse>
}

//事务列表
export const getTransctionList = (): Promise<HttpResponse> => {
  return http.post('/getTxList', '') as Promise<HttpResponse>
}

export const addTx = (param: addTxType): Promise<HttpResponse> => {
  return http.post('/addTx', param) as Promise<HttpResponse>
}
