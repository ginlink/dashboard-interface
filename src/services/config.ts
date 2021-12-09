/*
 * @Author: jiangjin
 * @Date: 2021-09-16 15:57:14
 * @LastEditTime: 2021-09-23 16:31:56
 * @LastEditors: jiangjin
 * @Description:
 *   与网络相关配置
 */

export const isDev = process.env.NODE_ENV === 'development'
// 注意，在测试环境中isDev为false
// console.log('[isDev]:', isDev)

// bsc浏览器地址，请不要加上http前缀
export const BSC_URL = isDev ? 'testnet.bscscan.com' : 'bscscan.com'

// TODO 后端Api接口地址
// export const BASE_URL = isDev ? 'http://16.162.188.15:9010/api' : 'http://16.162.188.15:9010/api'

//TODO 测试，记得改回来
export const BASE_URL = 'http://192.168.3.45:9771'
