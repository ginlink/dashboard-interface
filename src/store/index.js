import { createStore, applyMiddleware } from 'redux'
// import { combineReducers } from 'redux-immutable'
import thunk from 'redux-thunk'

import investmentReducer from './investment/modules'

// const reducer = combineReducers({
//   common: investmentReducer
// })

const store = createStore(investmentReducer, applyMiddleware(thunk))

export default store