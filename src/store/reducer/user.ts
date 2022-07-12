/**
 * @description 登录状态记录
 */

import { Dispatch } from 'redux'

interface LoginStatus {
  status: boolean
  token: string
  user: Record<any, any>
}

const LOGIN_IN = 'LOGIN_IN'
const LOGIN_OUT = 'LOGIN_OUT'
const USER_INFO = 'USER_INFO'

export const loginIn = (token: string) => {
  localStorage.setItem('__TOKEN__', token)
  return { type: LOGIN_IN, payload: token }
}

export const loginOut = () => {
  localStorage.removeItem('__TOKEN__')
  return { type: LOGIN_OUT }
}

export const userInfoAsync = (token: string) => {
  return (dispatch: Dispatch) => {
    setTimeout(() => {
      dispatch({
        type: USER_INFO,
        payload: {
          user: { name: '张三' },
          token,
        },
      })
    }, 1000)
  }
}
export const getLoginStatus = () => {
  return (dispatch: Dispatch) => {
    const token = localStorage.getItem('__TOKEN__')
    if (token) {
      dispatch(loginIn(token))
    }
  }
}

const initData = { status: false, token: '', user: {} }

export default function login(state: LoginStatus = initData, action: { type: string; payload?: any }) {
  switch (action.type) {
    case LOGIN_IN:
      return { status: true, token: action.payload }
    case LOGIN_OUT:
      return { status: false, token: null }
    case USER_INFO:
      return { status: true, token: action.payload.token, user: action.payload.user }
    default:
      return state
  }
}
