/*
 * @Author: jiangjin
 * @Date: 2021-09-01 14:25:47
 * @LastEditTime: 2021-09-15 14:55:22
 * @LastEditors: jiangjin
 * @Description:
 *   与交易相关state
 */

/* ******** Action ******* */
const ADD_TRANSACTION = 'ADD_TRANSACTION'
const FINNALIZE_TRANSACTION = 'FINNALIZE_TRANSACTION'
const UPDATE_TRANSACTION = 'UPDATE_TRANSACTION'
const CLEARALL_TRANSACTION = 'CLEARALL_TRANSACTION'

interface AddTransactionProps {
  chainId: number
  hash: string
  from: string
  approval?: { tokenAddress: string; spender: string }
  claim?: { recipient: string }
  summary?: string
}
interface FinalizeTransactionProps {
  chainId: number
  hash: string
  receipt: SerializableTransactionReceipt
}

interface UpdateTransactionProps {
  chainId: number
  hash: string
  blockNumber: number
}
interface ClearAllTransactionProps {
  chainId: number
}

export const addTransactionAction = (params: AddTransactionProps) => {
  return { type: ADD_TRANSACTION, payload: params }
}
export const FinalizeTransactionAction = (params: FinalizeTransactionProps) => {
  return { type: FINNALIZE_TRANSACTION, payload: params }
}
export const updateTransactionAction = (params: UpdateTransactionProps) => {
  return { type: UPDATE_TRANSACTION, payload: params }
}
export const clearAllTransactionAction = (params: ClearAllTransactionProps) => {
  return { type: CLEARALL_TRANSACTION, payload: params }
}

/* ******** Action End ******* */

export interface SerializableTransactionReceipt {
  to: string
  from: string
  contractAddress: string
  transactionIndex: number
  blockHash: string
  transactionHash: string
  blockNumber: number
  status?: number
}

export interface TransactionDetail {
  hash: string
  from: string
  addedTime: number

  approval?: { tokenAddress: string; spender: string }
  summary?: string
  claim?: { recipient: string }
  receipt?: SerializableTransactionReceipt
  lastCheckedBlockNumber?: number
  confirmedTime?: number
}

export interface TransictionState {
  [chainId: number]: {
    [txHash: string]: TransactionDetail
  }
}

export const initData: TransictionState = {}

interface Cases {
  [type: string]: (state: TransictionState, payload: any) => TransictionState
}

const now = () => new Date().getTime()

// 匹配各种type
const cases: Cases = {
  [ADD_TRANSACTION]: (state, payload) => {
    const { chainId, hash, summary, claim, from, approval } = payload as AddTransactionProps

    const txs = state[chainId] ?? {}

    if (txs[hash]) return state

    txs[hash] = { hash, approval, summary, claim, from, addedTime: now() }

    return { ...state, [chainId]: { ...txs } }
  },
  [FINNALIZE_TRANSACTION]: (state, payload) => {
    const { chainId, hash, receipt } = payload as FinalizeTransactionProps

    const txs = state[chainId]
    if (!txs?.[hash]) return state

    txs[hash].receipt = receipt
    txs[hash].confirmedTime = now()

    return { ...state, [chainId]: { ...txs } }
  },
  [UPDATE_TRANSACTION]: (state, payload) => {
    const { chainId, hash, blockNumber } = payload as UpdateTransactionProps

    const txs = state[chainId]
    if (!txs?.[hash]) return state

    const prevBlockNumber = txs[hash].lastCheckedBlockNumber

    if (!prevBlockNumber) {
      txs[hash].lastCheckedBlockNumber = blockNumber
    } else {
      txs[hash].lastCheckedBlockNumber = Math.max(blockNumber, prevBlockNumber)
    }

    return { ...state, [chainId]: { ...txs } }
  },
  [CLEARALL_TRANSACTION]: (state, payload) => {
    const { chainId } = payload as ClearAllTransactionProps

    if (!state[chainId]) return state

    return { ...state, [chainId]: {} }
  },
}

export default function transaction(
  state: TransictionState = initData,
  { type, payload }: { type: string; payload: any }
) {
  // 通过数组的方式来代替Switch，并用函数调用的方式避免在同一作用域
  // 而导致变量冲突问题

  try {
    return cases[type](state, payload)
  } catch (err) {
    // console.debug('[transaction](dispath不存在的action):', err)

    return state
  }
}

// 增加、清空、更新

/**
 * 先说tansactions主要要干什么？
 *   1.储存当前chainId的所有交易，页面可以根据当前交易状态做出对应展示
 *    重要的状态就是receipt（收据），表示此交易的结果
 *
 * 那reducer包含了哪些逻辑：
 *   1.创建交易记录（初始状态，未被解决）
 *   2.解决交易（最终状态，交易成功）
 *   3.更新交易blockNumber，主要用于retry（重试）
 *   4.清空交易记录
 */
