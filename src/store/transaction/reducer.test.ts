/*
 * @Author: jiangjin
 * @Date: 2021-09-15 12:16:37
 * @LastEditTime: 2021-09-15 14:28:57
 * @LastEditors: jiangjin
 * @Description:
 *
 */

import { createStore, Store } from 'redux'
import transactionReducer, {
  addTransactionAction,
  clearAllTransactionAction,
  FinalizeTransactionAction,
  initData,
  SerializableTransactionReceipt,
  TransictionState,
  updateTransactionAction,
} from './reducer'

describe('Trasaction store', () => {
  let store: Store<TransictionState>

  beforeEach(() => {
    store = createStore(transactionReducer, initData)
  })

  describe('add transaction', () => {
    it('add Trasaction', () => {
      const beforeTime = new Date().getTime()
      store.dispatch(
        addTransactionAction({
          chainId: 97,
          hash: '0x01',
          from: '0x123',

          summary: '第一个交易',
        })
      )

      const currentStore = store.getState()

      expect(currentStore[97]).toBeTruthy()

      const tx = currentStore[97]?.['0x01']

      expect(tx).toBeTruthy()
      expect(tx.hash).toBeTruthy()
      expect(tx.from).toBeTruthy()
      expect(tx.summary).toEqual('第一个交易')
      expect(tx.addedTime).toBeGreaterThanOrEqual(beforeTime)
    })
  })

  describe('update Transaction', () => {
    it('has no this transaction', () => {
      store.dispatch(
        updateTransactionAction({
          chainId: 97,
          hash: '0x01',
          blockNumber: 100,
        })
      )

      expect(store.getState()).toEqual({})
    })

    it('update transaction', () => {
      const chainId = 97
      const hash = '0x01'

      store.dispatch(
        addTransactionAction({
          chainId: chainId,
          hash: hash,
          from: '0x123',

          summary: '第一个交易',
        })
      )

      store.dispatch(
        updateTransactionAction({
          chainId: chainId,
          hash: hash,
          blockNumber: 100,
        })
      )

      const currentSotre = store.getState()
      expect(currentSotre[chainId][hash].lastCheckedBlockNumber).toEqual(100)
    })

    it('must be the Max blockNumber', () => {
      const chainId = 97
      const hash = '0x01'

      store.dispatch(
        addTransactionAction({
          chainId: chainId,
          hash: hash,
          from: '0x123',

          summary: '第一个交易',
        })
      )

      store.dispatch(
        updateTransactionAction({
          chainId: chainId,
          hash: hash,
          blockNumber: 100,
        })
      )
      store.dispatch(
        updateTransactionAction({
          chainId: chainId,
          hash: hash,
          blockNumber: 99,
        })
      )

      const currentSotre = store.getState()
      expect(currentSotre[chainId][hash].lastCheckedBlockNumber).toEqual(100)
    })
  })

  describe('finalize Transaction', () => {
    it('has no this trasaction', () => {
      store.dispatch(
        FinalizeTransactionAction({
          chainId: 97,
          hash: '0x01',
          receipt: {
            status: 1,
            transactionIndex: 1,
            transactionHash: '0x0',
            to: '0x0',
            from: '0x0',
            contractAddress: '0x0',
            blockHash: '0x0',
            blockNumber: 1,
          },
        })
      )

      expect(store.getState()).toEqual({})
    })

    it('finalize transaction', () => {
      const chainId = 97
      const hash = '0x01'

      store.dispatch(
        addTransactionAction({
          chainId: chainId,
          hash: hash,
          from: '0x123',

          summary: '第一个交易',
        })
      )

      store.dispatch(
        updateTransactionAction({
          chainId: chainId,
          hash: hash,
          blockNumber: 100,
        })
      )

      const receipt: SerializableTransactionReceipt = {
        status: 1,
        transactionIndex: 1,
        transactionHash: '0x0',
        to: '0x0',
        from: '0x0',
        contractAddress: '0x0',
        blockHash: '0x0',
        blockNumber: 1,
      }

      store.dispatch(
        FinalizeTransactionAction({
          chainId: chainId,
          hash: hash,
          receipt,
        })
      )

      const currentSotre = store.getState()
      expect(currentSotre[chainId][hash].receipt).toEqual(receipt)
    })
  })

  describe('clear all Transaction', () => {
    it('clear all transaction', () => {
      const chainId = 97

      store.dispatch(
        addTransactionAction({
          chainId: chainId,
          hash: '0x01',
          from: '0x123',

          summary: '第一个交易',
        })
      )

      store.dispatch(clearAllTransactionAction({ chainId: 10 }))

      expect(Object.keys(store.getState()[chainId])).toHaveLength(1)

      store.dispatch(
        addTransactionAction({
          chainId: chainId,
          hash: '0x02',
          from: '0x123',

          summary: '第二个交易',
        })
      )

      expect(Object.keys(store.getState()[chainId])).toHaveLength(2)

      store.dispatch(clearAllTransactionAction({ chainId }))

      expect(store.getState()[chainId]).toEqual({})
    })
  })
})
