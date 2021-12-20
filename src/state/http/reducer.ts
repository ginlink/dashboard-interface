import { TxPropsApi } from '@/services/api'
import { createReducer } from '@reduxjs/toolkit'
import { setTransactionList } from './actions'

export interface HttpState {
  transactionList: TxPropsApi[] | undefined
}

export const initialState: HttpState = {
  transactionList: undefined,
}

export default createReducer(initialState, (builder) =>
  builder.addCase(setTransactionList, (state, { payload: { list } }) => {
    if (!list) return

    state.transactionList = list
  })
)
