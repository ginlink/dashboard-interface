/*
 * @Author: jiangjin
 * @Date: 2021-09-14 18:32:09
 * @LastEditTime: 2021-10-28 16:14:08
 * @LastEditors: jiangjin
 * @Description:
 *
 */
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
