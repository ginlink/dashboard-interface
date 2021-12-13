import { FuncType } from '@/pages/CallAdmin/util'
import { BASE_URL_15 } from './config'
import http from './index'

interface SearchParams {
  name?: string
  start_time?: string
  end_time?: string
}

// export type addTxType = {
//   id?: number
//   txType?: number
//   txId?: string | number
//   txFrom?: string
//   txTo?: string
//   txAmount?: any
//   txHash?: string
//   txFun?: string
//   txFunArg?: string
//   txData?: string
//   txProaddr?: string
//   txSingal?: string
//   singal?: string
// }

export type TxPropsApi = {
  id?: number
  tx_type?: number
  tx_id?: string | number
  tx_from?: string
  tx_to?: string
  tx_amount?: any
  tx_hash?: string
  tx_fun?: string
  tx_fun_arg?: string
  tx_data?: string
  tx_proaddr?: string
  tx_singal?: string
}

export type CtFunctionRecord = {
  id?: number
}

export type CtFunction = {
  id?: number
  name?: string
  param?: string
  origin?: string
  record?: CtFunctionRecord
  desc?: string
  type?: FuncType
}

export const getTableLists = (searchParams: SearchParams) => {
  return http.post('/record/search', searchParams) as Promise<any>
}

export const addFunctionApi = (data: CtFunction) => {
  return http.post(BASE_URL_15 + '/ct-function', data) as Promise<any>
}

export const getFunctionApi = () => {
  return http.get(BASE_URL_15 + '/ct-function') as Promise<any>
}

export const searchFuncApi = (key: string) => {
  return http.get(BASE_URL_15 + '/ct-function/search', {
    key,
  }) as Promise<any>
}

//事务列表
export const getTransctionList = () => {
  return http.post('/getTxList', '') as Promise<any>
}

export const addTx = (param: TxPropsApi) => {
  return http.post('/addTx', param) as Promise<any>
}

export const updateTxById = (id: number, data: Partial<TxPropsApi>) => {
  return http.post('http://192.168.3.45:9771' + '/updateTxById', { id, ...data }) as Promise<any>
}

export const getTxById = (id: number) => {
  return http.post('http://192.168.3.45:9771' + '/getTxById', { id }) as Promise<any>
}
