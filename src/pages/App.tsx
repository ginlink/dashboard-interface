import React from 'react'
import { Redirect, Route, Switch } from 'react-router'
import Home from './Home'
import Contract from './Contract'

export default function App() {
  return (
    <>
      <Switch>
        <Route strict exact path="/home" component={Home} />
        <Route strict exact path="/contract" component={Contract} />

        <Redirect from="/" to="/home" />
      </Switch>
    </>
  )
}
