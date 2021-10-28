/*
 * @Author: jiangjin
 * @Date: 2021-09-14 18:32:09
 * @LastEditTime: 2021-09-15 14:45:24
 * @LastEditors: jiangjin
 * @Description:
 *
 */
import { combineReducers } from 'redux'
import * as LoginReducer from './user'
import * as ApplicationReducer from '../application/reducer'
import * as MulticalReducer from '../multicall/reducer'
import * as TransactionReducer from '../transaction/reducer'

export const dispatchs = {
  ...LoginReducer,
  ...ApplicationReducer,
  ...MulticalReducer,
  ...TransactionReducer,
}

export default combineReducers({
  login: LoginReducer.default,
  application: ApplicationReducer.default,
  multical: MulticalReducer.default,
  transaction: TransactionReducer.default,
})
