/*
 * @Author: jiangjin
 * @Date: 2021-10-11 14:40:29
 * @LastEditTime: 2021-10-25 18:56:40
 * @LastEditors: jiangjin
 * @Description:
 *
 */
import { createAction } from '@reduxjs/toolkit'

export const updateKeyString = createAction<{ keyUpString: string }>('liquidity/updateKeyString')
