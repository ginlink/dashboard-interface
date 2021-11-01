import React, { connect } from 'react-redux'
import { dispatchs } from '@/store/reducer/index'
import Router from '@/router/router'
const App = (props: any) => {
  return <Router store={props}></Router>
}
// store 注入到全局
export default connect((state: any) => ({ store: state }), { ...dispatchs })(App)
