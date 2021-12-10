/*
 * @Author: jiangjin
 * @Date: 2021-09-09 19:19:28
 * @LastEditTime: 2021-10-25 18:58:05
 * @LastEditors: jiangjin
 * @Description:
 *
 */
import { createReducer } from '@reduxjs/toolkit'
import { updateKeyString } from './actions'
const initialState = {
  keyUpString: '',
}

export default createReducer(initialState, (builder) =>
  builder.addCase(updateKeyString, (state, action) => {
    const { keyUpString } = action.payload
    state.keyUpString = keyUpString
  })
)
