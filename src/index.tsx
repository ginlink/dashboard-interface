import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createWeb3ReactRoot, Web3ReactProvider } from '@web3-react/core'
import 'antd/dist/antd.css'
import '@/assets/css/reset.css'

import App from './pages/App'

import store from '@/state'

import 'moment/locale/zh-cn'

import ThemeProvider, { ThemedGlobalStyle } from '@/theme'

// polyfill
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import AppLayout from './pages/AppLayout'
import { HashRouter } from 'react-router-dom'

import { NetworkContextName } from './constants/misc'
import Web3ReactManager from './components/Web3ReactManager'
import getLibrary from './utils/getLibrary'

import BigFloatNumber from 'bignumber.js'

// 设置全局BigFloatNumber的取舍模式，为向下取整
BigFloatNumber.set({ ROUNDING_MODE: BigFloatNumber.ROUND_DOWN })

const Web3ProviderNetwork = createWeb3ReactRoot(NetworkContextName)

if (!!window.ethereum) {
  window.ethereum.autoRefreshOnNetworkChange = false
}

ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Web3ProviderNetwork getLibrary={getLibrary}>
          <Web3ReactManager>
            <ThemeProvider>
              <ThemedGlobalStyle />
              <AppLayout>
                <App />
              </AppLayout>
            </ThemeProvider>
          </Web3ReactManager>
        </Web3ProviderNetwork>
      </Web3ReactProvider>
    </HashRouter>
  </Provider>,
  document.getElementById('root')
)
