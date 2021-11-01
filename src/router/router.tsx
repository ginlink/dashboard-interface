import React from 'react'
import { DefaultRootState } from 'react-redux'
import { Switch, HashRouter as Router, Route, Redirect, Link } from 'react-router-dom'
import routes from './index'
function mapRoutes(routes: any[], store: DefaultRootState): any {
  return routes.map((item: any, index: number) => {
    console.log(item, 'item')
    return (
      <Route
        exact={item.exact || false}
        path={item.path}
        key={index}
        render={(props) => {
          const NewComp = item.component
          Object.assign(props, {
            redirect: item.redirect || null,
            ...store,
          })
          if (item.routes) {
            return <NewComp {...props}>{mapRoutes(item.routes, store)}</NewComp>
          } else {
            return <NewComp {...props} />
          }
        }}
      />
    )
  })
}

// 例子
const Routes = (props: any) => (
  <Router>
    <Switch>
      <Route exact path="/" render={() => <Redirect to="/home" />} />
      {mapRoutes(routes, props.store)}
      <Route component={() => <div>Page not Found!</div>} />
    </Switch>
  </Router>
)

export default Routes
