import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { BASE_URL } from './config'

import { message } from 'antd'
import { parseParam } from './util'

interface HttpResponse<T = any> {
  data: T
  msg: string | null
  statusCode: number
  success: boolean
}

const instance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
})

instance.interceptors.request.use((config) => {
  // Add token
  const authInfo = sessionStorage.getItem('auth')
  if (!authInfo) location.href = '/#/login'
  config.headers.token = authInfo
  console.log('config', config)
  return config
})

instance.interceptors.response.use(
  (res: AxiosResponse<HttpResponse>) => {
    return res.data?.data as any as AxiosResponse<HttpResponse>
  },
  (err) => {
    const response = err.response

    const errCode = response?.status
    const data = response?.data
    data?.msg && message.error(data.msg)

    switch (errCode) {
      case 400:
        console.log('错误请求')
        break
      case 401:
      case 403:
        console.log('请求错误,权限问题')
        setTimeout(() => {
          location.href = '/#/login'
        }, 1000)
        break
      case 404:
        console.log('请求错误,未找到该资源')
        break
      case 405:
        console.log('请求方法未允许')
        break
      case 408:
        console.log('请求超时')
        break
      case 500:
        console.log('服务器端出错')
        break
      case 501:
        console.log('网络未实现')
        break
      case 502:
        console.log('网络错误')
        break
      case 503:
        console.log('服务不可用')
        break
      case 504:
        console.log('网络超时')
        break
      default:
        console.log('未知错误', errCode, err)
    }

    throw err
  }
)

export default {
  get: <T = any>(url: string, params: Record<string, any> = {}): Promise<HttpResponse<T>> => {
    return instance.get(url + parseParam(params))
  },
  post: <T = any>(url: string, data: any): Promise<HttpResponse<T>> => {
    return instance.post(url, data)
  },
  put: <T = any>(url: string, data: any): Promise<HttpResponse<T>> => {
    return instance.put(url, data)
  },
  delete: <T = any>(url: string): Promise<HttpResponse<T>> => {
    return instance.delete(url)
  },
  patch: <T = any>(url: string, params: any): Promise<HttpResponse<T>> => {
    return instance.patch(url, params)
  },
}
