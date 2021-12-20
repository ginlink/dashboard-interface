import { TxPropsApi } from '@/services/api'
import { createAction } from '@reduxjs/toolkit'

export const setTransactionList = createAction<{ list: TxPropsApi[] | undefined }>('farm/setTransactionList')
