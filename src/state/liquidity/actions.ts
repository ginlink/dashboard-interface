import { createAction } from '@reduxjs/toolkit'

export const updateKeyString = createAction<{ keyUpString: string }>('liquidity/updateKeyString')
