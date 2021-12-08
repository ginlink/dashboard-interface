export const isDev = process.env.NODE_ENV === 'development'
// 注意，在测试环境中isDev为false
// console.log('[isDev]:', isDev)

// bsc浏览器地址，请不要加上http前缀
export const BSC_URL = isDev ? 'testnet.bscscan.com' : 'bscscan.com'

// TODO 后端Api接口地址
export const BASE_URL = isDev ? 'http://localhost:9991/api' : 'http://16.162.188.15:9010/api'
