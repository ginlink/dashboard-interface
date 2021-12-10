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
import { useTokenContract } from '@/hooks/useContract'
import { useTransactionAdder } from '@/state/transactions/hooks'

export default function App() {
  const { account } = useActiveWeb3React()
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
