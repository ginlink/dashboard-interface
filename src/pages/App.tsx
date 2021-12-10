import React, { useEffect } from 'react'
import { Redirect, Route, Switch } from 'react-router'
import Home from './Home'
import Contract from './Contract'
import Tables from './Tables'
import MultiSign from './MultiSign'
import TransactionList from './TransactionList'
import CreationProcess from './MultiSign/CreationProcess'
import FastCall from './FastCall'
import CallAdmin from './CallAdmin'
import { useSingleCallResult } from '@/state/multicall/hooks'
import { useActiveWeb3React } from '@/hooks/web3'
import { useTokenContract, useTransactionProxy } from '@/hooks/useContract'
import { useTransactionAdder } from '@/state/transactions/hooks'
import { getSigner, safeSignTypedData } from '@/utils'
import { SafeTransaction } from '@/utils/execution'

export default function App() {
  const { account, library } = useActiveWeb3React()
  const tokenContract = useTokenContract('0x5B8698f10555F5Fb4fE58BFfc2169790e526D8AD')

  // const inputs = useMemo(() => {
  //   if (!account) return []

  //   return [account]
  // }, [account])

  // const result = useSingleCallResult(tokenContract, 'balanceOf', inputs)

  //   console.log('[](result):', result)
  // }, [result])

  const addTransaction = useTransactionAdder()

  // const inputs = useMemo(() => {
  //   return ['0x5B8698f10555F5Fb4fE58BFfc2169790e526D8AD', '10000']
  // }, [])

  // const result = useSingleCallResult(tokenContract, 'approve', inputs)

  // useEffect(() => {
  //   if (!tokenContract || !addTransaction) return

  //   tokenContract.approve('0x5B8698f10555F5Fb4fE58BFfc2169790e526D8AD', '10000').then((res) => addTransaction(res))
  // }, [addTransaction, tokenContract])

  const transactionProxy = useTransactionProxy()

  useEffect(() => {
    if (!library || !account || !transactionProxy) return

    const singer = getSigner(library, account)

    const safeTx: SafeTransaction = {
      baseGas: 0,
      data: '0x8d80ff0a00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000099005b8698f10555f5fb4fe58bffc2169790e526d8ad00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000044a9059cbb000000000000000000000000bf992941f09310b53a9f3436b0f40b25bccc2c330000000000000000000000000000000000000000000000000de0b6b3a764000000000000000000',
      gasPrice: 0,
      gasToken: '0x0000000000000000000000000000000000000000',
      nonce: 2,
      operation: 1,
      refundReceiver: '0x0000000000000000000000000000000000000000',
      safeTxGas: 0,
      to: '0xdEF572641Fac47F770596357bfb7432F78407ab3',
      value: 0,
    }

    safeSignTypedData(singer, transactionProxy, safeTx)
      .then((res) => {
        console.log('[safeSignTypedData](res):', res)
      })
      .catch((err) => {
        console.log('[safeSignTypedData](err):', err)
      })
  }, [account, library, transactionProxy])

  return (
    <>
      <Switch>
        <Route strict exact path="/home" component={Home} />
        <Route strict exact path="/strategy" component={Tables} />
        <Route strict exact path="/contract" component={Contract} />
        <Route strict exact path="/transactionList" component={TransactionList} />
        {/* <Route strict exact path="/multiSign" component={MultiSign} />
        <Route strict exact path="/multiSign/create" component={CreationProcess} /> */}
        <Route strict exact path="/fast_call" component={FastCall} />
        <Route strict exact path="/call_admin" component={CallAdmin} />

        <Redirect from="/" to="/home" />
      </Switch>
    </>
  )
}
