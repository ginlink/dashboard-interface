import axios, { AxiosInstance } from 'axios'
// import { BASE_URL } from './config'
const BASE_URL = 'http://192.168.3.42:3099/api'

enum Methods {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
  PATCH = 'patch',
}

/**
 * 二次封装axios
 * @param {String} method Ajax请求类型 'POST'|'PUT'|'GET'|'DELETE'|'PATCH'
 * @param {String} url 请求地址
 * @param {Object} params  参数
 * @returns Promise<T>
 */
function apiAxios<P, R>(method: Methods, url: string, params: P) {
  return new Promise<R>((resolve, reject) => {
    // axios.defaults.headers.common.Authorization = localStorage.getItem('accessToken')
    // 设置默认头部

    const instance: AxiosInstance = axios.create({
      baseURL: BASE_URL,
      timeout: 60000,
    })

    instance[method](url, {
      data: method === Methods.POST || method === Methods.PUT ? params : null,
      params: method === Methods.GET || method === Methods.DELETE || method === Methods.PATCH ? params : null,
      withCredentials: false,
    })
      .then((res: any) => {
        if (res?.status === 200 || res?.status === 201) {
          resolve(res.data)
        } else {
          reject('Axios返回状态不对，查看请求处理过程．．．．')
        }
      })
      .catch((err: any) => {
        const errCode = err?.response?.status
        switch (errCode) {
          case 400:
            console.log('错误请求')
            break
          case 401:
            console.log('请求错误,权限问题')
            break
          case 403:
            console.log('请求错误,权限问题')
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
      })
  })
}
export default {
  get: (url: string, params: any = {}) => {
    return apiAxios(Methods.GET, url, params)
  },
  post: (url: string, data: any) => {
    return apiAxios(Methods.POST, url, data)
  },
  put: (url: string, data: any) => {
    return apiAxios(Methods.PUT, url, data)
  },
  delete: (url: string, params: any) => {
    return apiAxios(Methods.DELETE, url, params)
  },
  patch: (url: string, params: any) => {
    return apiAxios(Methods.PATCH, url, params)
  },
}
