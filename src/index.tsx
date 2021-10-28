/*
 * @Author: jiangjin
 * @Date: 2021-09-01 10:32:22
 * @LastEditTime: 2021-09-26 10:11:04
 * @LastEditors: jiangjin
 * @Description: In User Settings Edit
 * @FilePath: /converter-bsc-web/src/index.tsx
 */
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core'

import App from './pages/App'
import store from '@/store'
import axios from 'axios'
import { ConfigProvider } from 'antd'

import zhCN from 'antd/es/locale/zh_CN'
import 'moment/locale/zh-cn'

import ThemeProvider, { ThemedGlobalStyle } from '@/theme'

import ApplicationUpdater from '@/store/application/updater'
import MulticallUpdater from '@/store/multicall/updater'
import TransactionUpdater from '@/store/transaction/updater'

// polyfill
import 'core-js/stable'
import 'regenerator-runtime/runtime'
import './i18n'

import AppLayout from './pages/AppLayout'
import { HashRouter } from 'react-router-dom'

import '@/assets/css/reset.css'

import { NetworkContextName } from './constants/misc'
import Web3ReactManager from './components/Web3ReactManager'
import getLibrary from './utils/getLibrary'

import BigFloatNumber from 'bignumber.js'

// 设置全局BigFloatNumber的取舍模式，为向下取整，原因有两个：
// 1.返回的数据精度是小数点后18位，而用BigFloatNumber计算后的结果精度大于18位，所以要截取超出的精度
// 2.且etherjs的BigNumber是向下取整
// 为了与etherjs的BigNumber区分，这里取名为BigFloatNumber
BigFloatNumber.set({ ROUNDING_MODE: BigFloatNumber.ROUND_DOWN })

// 向下取整，etherjs的BigNumber是向下取整，如下：
// console.log('[div]:', BigNumber.from('124').div(3).toString())

// 为什么不用etherjs的BigNumber？
// 因为不支持小数，有的从合约或者uniswap拿到的数据可能并不是BigNumber

const service = axios.create({
  baseURL: '/',
  timeout: 15000,
})

service.interceptors.request.use(function (config) {
  return config
})

service.interceptors.response.use(function (config) {
  return config
})

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName)

if (!!window.ethereum) {
  window.ethereum.autoRefreshOnNetworkChange = false
}

function Updater() {
  return (
    <>
      <ApplicationUpdater />
      <MulticallUpdater />
      <TransactionUpdater />
    </>
  )
}

ReactDOM.render(
  <Provider store={store}>
    <ConfigProvider locale={zhCN}>
      <HashRouter>
        <Web3ReactProvider getLibrary={getLibrary}>
          <Web3ProviderNetwork getLibrary={getLibrary}>
            <Web3ReactManager>
              <ThemeProvider>
                <ThemedGlobalStyle />
                <Updater />
                <AppLayout>
                  <App />
                </AppLayout>
              </ThemeProvider>
            </Web3ReactManager>
          </Web3ProviderNetwork>
        </Web3ReactProvider>
      </HashRouter>
    </ConfigProvider>
  </Provider>,
  document.getElementById('root')
)
