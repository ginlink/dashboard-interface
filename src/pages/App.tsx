import React, { Redirect, Route, Switch } from 'react-router'

import Home from './Home'
import Tables from './Tables'
import TransactionList from './TransactionList'
import FastCall from './FastCall'
import CallAdmin from './CallAdmin'
import CtAddress from './CtAddress'
import { useTransactionList } from '@/state/http/hooks'
import { useEffect } from 'react'
import Login from './login'
import AppLayout from './AppLayout'
export default function App() {
  const list = useTransactionList()
  useEffect(() => {
    console.log('[](list):', list)
  }, [list])

  return (
    <>
      <Switch>
        <Route strict exact path="/login" component={Login} />
        <AppLayout>
          <Route strict exact path="/home" component={Home} />
          <Route strict exact path="/strategy" component={Tables} />
          <Route strict exact path="/transactionList" component={TransactionList} />
          <Route strict exact path="/fast_call" component={FastCall} />
          <Route strict exact path="/call_admin" component={CallAdmin} />
          <Route strict exact path="/ct_address" component={CtAddress} />

          <Redirect from="/" to="/home" />
        </AppLayout>
      </Switch>
    </>
  )
}
