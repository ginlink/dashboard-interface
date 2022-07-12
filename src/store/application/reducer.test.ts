import { createStore, Store } from 'redux'
import { addPopupAction, removePopupAction } from './action'
import reducer, { ApplicationState, initData } from './reducer'

describe('application test', () => {
  let store: Store<ApplicationState>
  beforeEach(() => {
    store = createStore(reducer, initData)
  })

  describe('add && remove popup test', () => {
    it('add popup', () => {
      store.dispatch(addPopupAction({ tx: { hash: '0x01', success: true } }))

      expect(Object.keys(store.getState().popupContainer)).toHaveLength(1)

      store.dispatch(addPopupAction({ tx: { hash: '0x01', success: true } }))
      store.dispatch(addPopupAction({ tx: { hash: '0x01', success: true } }))
      store.dispatch(addPopupAction({ tx: { hash: '0x01', success: true } }))
      store.dispatch(addPopupAction({ tx: { hash: '0x01', success: true } }, 20000, '99'))

      Object.keys(store.getState().popupContainer).forEach((key) => {
        console.log('[]:', key)
      })

      expect(Object.keys(store.getState().popupContainer)).toHaveLength(2)
    })

    it('add && remomve popup', () => {
      store.dispatch(addPopupAction({ tx: { hash: '0x01', success: true } }, 20000, '456'))

      expect(Object.keys(store.getState().popupContainer)).toHaveLength(1)
      expect(store.getState().popupContainer).toEqual({
        '456': { content: { tx: { hash: '0x01', success: true } }, removeAfterMs: 20000 },
      })

      // remove popup
      store.dispatch(removePopupAction('456'))

      expect(store.getState().popupContainer).toEqual({})
    })
  })
})
