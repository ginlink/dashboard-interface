import Farm from '@/pages/Farm'
import Home from '@/pages/Home'
import Set from '@/pages/Set'
import Profile from '@/pages/Profile'
import SingleFarm from '@/pages/SingleFarm'
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
    {/* <Link to="/home">home</Link> | <Link to="/new">new</Link> 【<Link to="/new/list">new-list</Link> |{' '}
    <Link to="/new/content">new-content</Link>】 */}

    <Switch>
      <Route exact path="/home" render={() => <Home />} />
      <Route exact path="/set" render={() => <Set />} />
      <Route exact path="/single-farm" render={() => <SingleFarm />} />
      <Route exact path="/farm" render={() => <Farm />} />
      <Route exact path="/profile" render={() => <Profile />} />

      <Redirect from="/" to="/home" />
      {/* {mapRoutes(routes, props.store)} */}
      {/* <Route component={() => <div>Page not Found!</div>} /> */}
    </Switch>
  </Router>
)

export default Routes
