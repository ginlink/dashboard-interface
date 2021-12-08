import React from 'react'
import { Redirect, Route, Switch } from 'react-router'
import Home from './Home'
import Contract from './Contract'
import Tables from './Tables'
import MultiSign from './MultiSign'
import TransactionList from './TransactionList'
import CreationProcess from './MultiSign/CreationProcess'
export default function App() {
  return (
    <>
      <Switch>
        <Route strict exact path="/home" component={Home} />
        <Route strict exact path="/strategy" component={Tables} />
        <Route strict exact path="/contract" component={Contract} />
        <Route strict exact path="/transactionList" component={TransactionList} />
        {/* <Route strict exact path="/multiSign" component={MultiSign} />
        <Route strict exact path="/multiSign/create" component={CreationProcess} /> */}

        <Redirect from="/" to="/home" />
      </Switch>
    </>
  )
}
