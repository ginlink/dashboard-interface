import React, { Redirect, Route, Switch, useHistory, useLocation } from 'react-router'

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
import SheepConifg from './sheepConfig'

export default function App() {
  const { pathname } = useLocation()
  const history = useHistory()
  useEffect(() => {
    const auth = sessionStorage.getItem('auth')

    if (!auth) {
      history.push('/login')
    }
  }, [history, pathname])
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
          <Route strict exact path="/sheepconfig" component={SheepConifg} />

          <Redirect from="/" to="/home" />
        </AppLayout>
      </Switch>
    </>
  )
}
