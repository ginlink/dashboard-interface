import React, { connect } from 'react-redux'
import { dispatchs } from '@/store/reducer/index'
import Router from '@/router/router'
import Header from '@/components/Header'

const App = (props: any) => {
  return (
    <>
      <Header />
      <Router store={props} />
    </>
  )
}
// store 注入到全局
export default connect((state: any) => ({ store: state }), { ...dispatchs })(App)
