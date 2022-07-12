import { ApplicationModal } from './reducer'

export const SET_SCREEN_WIDTH = 'SET_SCREEN_WIDTH'
export const SET_OPENMODAL = 'SET_OPENMODAL'
export const UPDATE_BLOCK_NUMBER = 'UPDATE_BLOCK_NUMBER'

export const ADD_POPUP = 'ADD_POPUP'
export const REMOVE_POPUP = 'REMOVE_POPUP'

export interface PopupContent {
  tx: {
    hash: string
    success: boolean
    summary?: string
  }
}

export const setScreenWidthAction = (width: number | undefined) => {
  return { type: SET_SCREEN_WIDTH, payload: { width } }
}

export const setOpenmodalAction = (modal: ApplicationModal | undefined) => {
  return { type: SET_OPENMODAL, payload: modal }
}

export const updateBlockNumberAction = (chainId: number, blockNumber: number) => {
  return { type: UPDATE_BLOCK_NUMBER, payload: { chainId, blockNumber } }
}

export const addPopupAction = (content: PopupContent, removeAfterMs?: number, key?: string) => {
  return { type: ADD_POPUP, payload: { key, content, removeAfterMs } }
}

export const removePopupAction = (key: string) => {
  return { type: REMOVE_POPUP, payload: { key } }
}
