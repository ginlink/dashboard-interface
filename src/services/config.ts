export const isDev = process.env.NODE_ENV === 'development'

export const EXPLORER_LINK: {
  [chainId: number]: string
} = {
  [322]: 'https://scan-testnet.kcc.network',
  [321]: 'https://explorer.kcc.io',
}

// TODO 后端Api接口地址
// export const BASE_URL = isDev ? 'http://16.162.188.15:9010/api' : 'http://16.162.188.15:9010/api'

//TODO 测试，记得改回来
// export const BASE_URL = 'http://192.168.3.45:9771'
// export const BASE_URL = 'http://18.163.77.160:4801/'
// export const BASE_URL = isDev ? 'http://localhost:9991/api' : 'http://16.162.188.15:9010/api'

export const BASE_URL = process.env.REACT_APP_BASE_URL

export const BASE_URL_15 = 'ttp://18.163.77.160:4801/'

export const BASE_URL_Mainnet = 'http://16.162.14.42:9010/'
