/*
 * @Author: jiangjin
 * @Date: 2021-09-01 14:25:47
 * @LastEditTime: 2021-09-16 16:25:58
 * @LastEditors: jiangjin
 * @Description:
 *  与应用相关的全局状态
 */

import { SET_SCREEN_WIDTH, SET_OPENMODAL, UPDATE_BLOCK_NUMBER, ADD_POPUP, REMOVE_POPUP, PopupContent } from './action'
import { nanoid } from 'nanoid'

// 在同一时间，只会存在一个打开的模态框
export enum ApplicationModal {
  MENU,
}
export interface ApplicationState {
  screenWidth: number | undefined
  openModal: ApplicationModal | undefined
  blockNumber: {
    [chainId: number]: number
  }
  popupContainer: {
    [key: string]: { content: PopupContent; removeAfterMs: number }
  }
}

export const initData: ApplicationState = {
  screenWidth: undefined,
  openModal: undefined,
  blockNumber: {},
  popupContainer: {},
}

interface UpdateBlockNumberProps {
  chainId: number
  blockNumber: number
}
interface AddPopupProps {
  content: PopupContent
  removeAfterMs?: number
  key?: string
}
interface RemovePopupProps {
  key: string
}

// 用于生成popup的key，自增长，解决对象不按顺序遍历的问题
let popupCounter = 1

interface Cases {
  [type: string]: (state: ApplicationState, payload: any) => ApplicationState
}
const cases: Cases = {
  [SET_SCREEN_WIDTH]: (state, payload) => {
    const { width } = payload
    return { ...state, screenWidth: width }
  },
  [SET_OPENMODAL]: (state, payload) => {
    return { ...state, openModal: payload }
  },
  [UPDATE_BLOCK_NUMBER]: (state, payload) => {
    const { chainId, blockNumber } = payload as UpdateBlockNumberProps
    if (chainId) {
      const prevBlockNumber = { ...state.blockNumber }

      prevBlockNumber[chainId] = blockNumber

      return { ...state, blockNumber: prevBlockNumber }
    }

    return state
  },
  [ADD_POPUP]: (state, payload: AddPopupProps) => {
    const { key, content, removeAfterMs } = payload ?? {}
    // console.log('[]:', key, content, removeAfterMs)

    // 用nanoid生成唯一值
    const popKey = key ? key : popupCounter++
    const popRemoveAfterMs = removeAfterMs ? removeAfterMs : 25000

    const container = JSON.parse(JSON.stringify(state.popupContainer))

    container[popKey] = {
      content,
      removeAfterMs: popRemoveAfterMs,
    }

    return { ...state, popupContainer: { ...container } }
  },
  [REMOVE_POPUP]: (state, payload: RemovePopupProps) => {
    const container = JSON.parse(JSON.stringify(state.popupContainer))
    const { key } = payload

    if (container[key]) {
      delete container[key]
      return { ...state, popupContainer: { ...container } }
    }

    return state
  },
}

export default function application(
  state: ApplicationState = initData,
  { type, payload }: { type: string; payload?: any }
) {
  try {
    return cases[type](state, payload)
  } catch (err) {
    return state
  }
}
