import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import reducers from './reducer'

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const store =
  process.env.NODE_ENV === 'development'
    ? createStore(reducers, composeEnhancers(applyMiddleware(thunk, logger)))
    : createStore(reducers, applyMiddleware(thunk))

export default store
