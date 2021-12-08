import http from './index'

interface SearchParams {
  name?: string
  start_time?: string
  end_time?: string
}

export type CtFunctionRecord = {
  id?: number
}

export type CtFunction = {
  id?: number
  function: string
  record?: CtFunctionRecord
  desc?: string
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
