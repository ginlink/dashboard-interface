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
export const getTableLists = (searchParams: SearchParams): Promise<HttpResponse> => {
  return http.post('/record/search', searchParams) as Promise<HttpResponse>
}
