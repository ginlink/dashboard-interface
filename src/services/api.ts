import { FuncType } from '@/pages/CallAdmin/util'
import http from './index'

interface SearchParams {
  name?: string
  start_time?: string
  end_time?: string
}
type addTxType = {
  txType?: number
  txId?: string | number
  txFrom?: string
  txTo?: string
  txAmount?: any
  txHash?: string
  txFun?: string
  txFunArg?: string
  txData?: string
  txProaddr?: string
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
  return http.post('/ct-function', data) as Promise<any>
}

export const getFunctionApi = () => {
  return http.get('/ct-function') as Promise<any>
}

export const searchFuncApi = (key: string) => {
  return http.get('/ct-function/search', {
    key,
  }) as Promise<any>
}

//事务列表
export const getTransctionList = () => {
  return http.post('/getTxList', '') as Promise<any>
}

export const addTx = (param: addTxType) => {
  return http.post('/addTx', param) as Promise<any>
}
