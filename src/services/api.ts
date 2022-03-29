import { FuncType } from '@/pages/CallAdmin/util'
import { BASE_URL_15, BASE_URL_Mainnet } from './config'
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

export enum TxStatusEnum {
  SUCCESS = 1,
  LOADING,
  FAILED,
  UNKNOWN,
}

export type TxPropsApi = {
  id?: number
  txType?: number
  txId?: string
  txFrom?: string
  txTo?: string
  txAmount?: any
  txHash?: string
  txFun?: string
  txFunArg?: string
  txData?: string
  txProaddr?: string
  txSingal?: string

  txStatus?: TxStatusEnum
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
export type LoginType = {
  username: string
  password: string
}

export class AddressSearchParams {
  page?: number
  limit?: number
  key_address?: string
  key_symbol?: string
  key_chainid?: number;

  [key: string]: any
}
export type SheepHomeStatusParams = {
  homestatus?: string
  lastversion?: string
}

export const getTableLists = (searchParams: SearchParams) => {
  return http.post(BASE_URL_15 + '/record/search', searchParams) as Promise<any>
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

export const loginApi = (loginData: LoginType) => {
  return http.post('/login', loginData) as Promise<any>
}

//事务列表
export const getTransctionList = () => {
  return http.post('/getTxList', '') as Promise<any>
}

export const addTx = (param: TxPropsApi) => {
  return http.post('/addTx', param) as Promise<any>
}

export const updateTxById = (id: number, data: Partial<TxPropsApi>) => {
  return http.post('/updateTxById', { id, ...data }) as Promise<any>
}

export const getTxById = (id: number) => {
  return http.post('/getTxById', { id }) as Promise<any>
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

export const searchCtAddressApi = (addressSearchParams?: AddressSearchParams) => {
  return http.get(BASE_URL_15 + '/ct-address' + '/search', addressSearchParams) as Promise<any>
}

//  sheep 配置

export const sheepHomeStatus = () => {
  return http.get(BASE_URL_Mainnet + '/homestatus') as Promise<any>
}

export const setSheepHomeStatus = (sheepHomeStatusParams?: SheepHomeStatusParams) => {
  return http.put(BASE_URL_Mainnet + '/homestatus', sheepHomeStatusParams) as Promise<any>
}
