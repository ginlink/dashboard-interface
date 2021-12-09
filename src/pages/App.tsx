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
import { useSignatureBytes } from './TransactionList/hooks'

export default function App() {
  // const singer = useSignatureBytes([
  //   '0x0F70D0661bA51a0383f59E76dC0f2d44703A8680',
  //   '0xD06803c7cE034098CB332Af4C647f293C8BcD76a',
  //   '0xf0a734400c8BD2e80Ba166940B904C59Dd08b6F0',
  //   '0xBf992941F09310b53A9F3436b0F40B25bCcc2C33',
  // ])

  // useEffect(() => {
  //   console.log('[](singer):', singer)
  // }, [singer])

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
