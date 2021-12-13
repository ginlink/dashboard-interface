import { FuncType } from '@/pages/CallAdmin/util'
import { BASE_URL_15 } from './config'
import http from './index'

interface SearchParams {
  name?: string
  start_time?: string
  end_time?: string
}

export type addTxType = {
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

export type CtAddress = {
  id?: number
  chainId: number
  address: string
  decimals?: number
  symbol?: string
  logoURI?: string
  desc?: string
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

export const addTx = (param: addTxType) => {
  return http.post('/addTx', param) as Promise<any>
}

export const getCtAddressApi = () => {
  return http.get(BASE_URL_15 + '/ct-address') as Promise<any>
}

export const crateCtAddressApi = (data: CtAddress) => {
  return http.post(BASE_URL_15 + '/ct-address', data) as Promise<any>
}

export const deleteCtAddressApi = (id: number) => {
  return http.delete(BASE_URL_15 + '/ct-address' + '/' + id) as Promise<any>
}

export const updateCtAddressApi = (id: number, data: CtAddress) => {
  return http.patch(BASE_URL_15 + '/ct-address' + '/' + id, data) as Promise<any>
}
