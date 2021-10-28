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

export const getLiquidityList = (): Promise<HttpResponse> => {
  return http.get('/getLiquidity') as Promise<HttpResponse>
}
