/*
 * @Author: your name
 * @Date: 2021-09-01 10:32:22
 * @LastEditTime: 2021-09-26 10:22:18
 * @LastEditors: jiangjin
 * @Description: In User Settings Edit
 * @FilePath: /converter-bsc-web/src/pages/App.tsx
 */
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { dispatchs } from '@/store/reducer/index'
import { debunce } from '@/utils/debunce'
import { useActiveWeb3React } from '@/hooks/web3'
import Router from '@/router/router'
import { useScreenWidth, useSetScreenWidth } from '@/store/application/hooks'
import TestApproveToken from './TestApproveToken'
import TestTransactionModal from './TestTransactionModal'
import TestCallContract from './TestCallContract'
import Header from '@/components/Header'
import { useIsPcByScreenWidth } from '@/hooks/useIsPc'
import TestAnimation from './TestAnimation'

import BigFloatNumber from 'bignumber.js'
// import TestApproveToken from './TestApproveToken'

// export const contractStore = new Map<string, T extends Contract>()

// const contractMap = new Map<string, any>()

// export function contractStore<T>(): Map<string, T & Contract> {
//   return contractMap
// }

// delete dispatchs.default

const App = (props: any) => {
  const setScreenWidth = useSetScreenWidth()
  const screentWidth = useScreenWidth()

  // 监听屏幕变化
  useEffect(() => {
    const debouncedSetScreenWidth = debunce((width: number) => {
      setScreenWidth(width)
    }, 50)

    debouncedSetScreenWidth(window.innerWidth)
    window.onresize = function () {
      debouncedSetScreenWidth(window.innerWidth)
    }
  }, [setScreenWidth])

  useEffect(() => {
    console.debug('[screentWidth]:', screentWidth)
  }, [screentWidth])

  const { account, library } = useActiveWeb3React()

  useEffect(() => {
    if (!account) return

    library?.getBalance(account).then((res) => {
      console.debug('[调试](账户余额):', res)
    })
  }, [account, library])

  const [open, setopen] = useState(false)

  const isPc = useIsPcByScreenWidth()

  useEffect(() => {
    console.debug('[isPc]:', isPc)
  }, [isPc])
  return (
    <>
      {/* <h1 onClick={() => setopen(true)}>打开模态框</h1> */}
      {/* <SetClaimModal
        isOpen={open}
        onDismiss={() => {
          setopen((prev) => !prev)
        }}
        token={exampleDoubleTokens}
      /> */}
      {/* <SaveSingleModal
        isOpen={open}
        onDismiss={() => {
          setopen((prev) => !prev)
        }}
        token={exampleSingleToken}
      /> */}
      {/* <SaveDoubleModal
        isOpen={open}
        onDismiss={() => {
          setopen((prev) => !prev)
        }}
        token={exampleDoubleTokens}
      /> */}
      {/* <ClaimModal
        isOpen={open}
        onDismiss={() => {
          setopen((prev) => !prev)
        }}
        token={exampleSingleToken}
      /> */}
      {/* 测试一些组件 */}
      {/* <TestSwiper /> */}
      {/* <TestCallContract /> */}
      {/* <TestCallContractByHex /> */}
      {/* <TestApproveToken /> */}
      {/* <TestTransactionModal /> */}
      {/* 测试一些组件 End */}

      {/* 动画 */}
      {/* <TestAnimation /> */}

      <Header />
      <Router store={props} />
    </>
  )
}
// store 注入到全局
export default connect((state: any) => ({ store: state }), { ...dispatchs })(App)
