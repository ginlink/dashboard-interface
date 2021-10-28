/*
 * @Author: jiangjin
 * @Date: 2021-09-15 17:43:24
 * @LastEditTime: 2021-09-15 21:02:18
 * @LastEditors: jiangjin
 * @Description:
 *
 */

import { createStore, Store } from 'redux'
import reducer, {
  addMulticallListenerAction,
  Call,
  initData,
  MulticalState,
  removeMulticallListenersAction,
  updateMulticallListenersAction,
} from './reducer'

const DAI_ADDRESS = '0x6b175474e89094c44da98b954eedeac495271d0f'

describe('muticall reducer', () => {
  let store: Store<MulticalState>
  beforeEach(() => {
    store = createStore(reducer, initData)
  })

  const call1: Call = {
    address: DAI_ADDRESS,
    callData: '0x',
  }
  const call2: Call = {
    address: DAI_ADDRESS,
    callData: '0x',
  }

  describe('remove listeners', () => {
    it('add listeners', () => {
      store.dispatch(
        addMulticallListenerAction({
          chainId: 97,
          calls: [call1],
        })
      )
      expect(store.getState().callLiteners[97]).toEqual({
        [`${DAI_ADDRESS}-0x`]: { ['1']: 1 },
      })
    })

    it('remove listeners', () => {
      store.dispatch(
        addMulticallListenerAction({
          chainId: 97,
          calls: [call1],
        })
      )

      store.dispatch(
        removeMulticallListenersAction({
          chainId: 97,
          calls: [call1],
        })
      )

      // console.log('[]:', store.getState().callLiteners[97])
      expect(store.getState().callLiteners[97]).toEqual({ [`${DAI_ADDRESS}-0x`]: {} })
    })
  })

  describe('update listeners', () => {
    it('update listeners', () => {
      store.dispatch(
        addMulticallListenerAction({
          chainId: 97,
          calls: [call1],
        })
      )

      expect(store.getState().callLiteners[97]).toEqual({
        [`${DAI_ADDRESS}-0x`]: { ['1']: 1 },
      })

      store.dispatch(
        updateMulticallListenersAction({
          chainId: 97,
          calls: [call1],
          options: {
            blocksPerFetch: 999,
          },
        })
      )

      expect(store.getState().callLiteners[97]).toEqual({
        [`${DAI_ADDRESS}-0x`]: { ['999']: 1 },
      })
    })
  })
})
