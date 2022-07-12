import { combineReducers } from 'redux'
import * as LoginReducer from './user'
import * as ApplicationReducer from '../application/reducer'

export const dispatchs = {
  ...LoginReducer,
  ...ApplicationReducer,
}

export default combineReducers({
  login: LoginReducer.default,
  application: ApplicationReducer.default,
})
