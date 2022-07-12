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
