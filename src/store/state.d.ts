/*
 * @Author: jiangjin
 * @Date: 2021-09-01 14:38:53
 * @LastEditTime: 2021-09-15 14:46:42
 * @LastEditors: jiangjin
 * @Description:
 *
 */
import { MulticalState } from './multicall/reducer'
import { ApplicationState } from './application/reducer'
import { TransictionState } from './transaction/reducer'

interface RootState {
  application: ApplicationState
  multical: MulticalState
  transaction: TransictionState
}
