import { MaxUint256 } from '@ethersproject/constants'
import { TransactionResponse } from '@ethersproject/providers'
import { CurrencyAmount, Currency } from 'plugins/@uniswap/sdk-core'
import { useCallback, useMemo } from 'react'
import { useTransactionAdder, useHasPendingApproval } from '../store/transaction/hooks'
import { calculateGasMargin } from '../utils/calculateGasMargin'
import { useTokenContract, useVaultContract } from './useContract'
import { useActiveWeb3React } from './web3'
import { useAllowance, useTokenAllowance } from './useTokenAllowance'

import BigFloatNumber from 'bignumber.js'
import { BigNumber } from '@ethersproject/bignumber'
import { debuglog } from 'util'

export enum ApprovalState {
  UNKNOWN = 'UNKNOWN',
  NOT_APPROVED = 'NOT_APPROVED',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useApproveCallback(
  amountToApprove?: CurrencyAmount<Currency>,
  spender?: string
): [ApprovalState, () => Promise<void>] {
  const { account } = useActiveWeb3React()
  const token = amountToApprove?.currency?.isToken ? amountToApprove.currency : undefined
  const currentAllowance = useTokenAllowance(token, account ?? undefined, spender)
  const pendingApproval = useHasPendingApproval(token?.address, spender)

  // check the current approval status
  const approvalState: ApprovalState = useMemo(() => {
    if (!amountToApprove || !spender) return ApprovalState.UNKNOWN
    if (amountToApprove.currency.isNative) return ApprovalState.APPROVED
    // we might not have enough data to know whether or not we need to approve
    if (!currentAllowance) return ApprovalState.UNKNOWN

    // amountToApprove will be defined if currentAllowance is
    return currentAllowance.lessThan(amountToApprove)
      ? pendingApproval
        ? ApprovalState.PENDING
        : ApprovalState.NOT_APPROVED
      : ApprovalState.APPROVED
  }, [amountToApprove, currentAllowance, pendingApproval, spender])

  const vaultContract = useTokenContract(token?.address)
  const addTransaction = useTransactionAdder()

  const approve = useCallback(async (): Promise<void> => {
    if (approvalState !== ApprovalState.NOT_APPROVED) {
      console.error('approve was called unnecessarily')
      return
    }
    if (!token) {
      console.error('no token')
      return
    }

    if (!vaultContract) {
      console.error('vaultContract is null')
      return
    }

    if (!amountToApprove) {
      console.error('missing amount to approve')
      return
    }

    if (!spender) {
      console.error('no spender')
      return
    }

    let useExact = false
    const estimatedGas = await vaultContract.estimateGas.approve(spender, MaxUint256).catch(() => {
      // general fallback for tokens who restrict approval amounts
      useExact = true
      return vaultContract.estimateGas.approve(spender, amountToApprove.quotient.toString())
    })

    return vaultContract
      .approve(spender, useExact ? amountToApprove.quotient.toString() : MaxUint256, {
        gasLimit: calculateGasMargin(estimatedGas),
      })
      .then((response: TransactionResponse) => {
        addTransaction(response, {
          summary: 'Approve ' + amountToApprove.currency.symbol,
          approval: { tokenAddress: token.address, spender: spender },
        })
      })
      .catch((error: Error) => {
        console.debug('Failed to approve token', error)
        throw error
      })
  }, [approvalState, token, vaultContract, amountToApprove, spender, addTransaction])

  return [approvalState, approve]
}

export function useApproveCallbackWithVault(
  vaultAddress: string | undefined,
  spender?: string
): [ApprovalState, () => Promise<void>] {
  const { account } = useActiveWeb3React()

  const vaultContract = useVaultContract(vaultAddress)
  const currentAllowance = useAllowance(vaultContract, account ?? undefined, spender)

  const pendingApproval = useHasPendingApproval(vaultAddress, spender)

  // check the current approval status
  const approvalState: ApprovalState = useMemo(() => {
    if (!vaultAddress || !spender) return ApprovalState.UNKNOWN
    // we might not have enough data to know whether or not we need to approve
    if (!currentAllowance) return ApprovalState.UNKNOWN

    debugger

    console.log('[](BigNumber.from(currentAllowance), MaxUint256):', BigNumber.from(currentAllowance), MaxUint256)
    // amountToApprove will be defined if currentAllowance is
    return BigNumber.from(currentAllowance).lt(MaxUint256)
      ? pendingApproval
        ? ApprovalState.PENDING
        : ApprovalState.NOT_APPROVED
      : ApprovalState.APPROVED
  }, [currentAllowance, pendingApproval, spender, vaultAddress])

  // const vaultContract = useTokenContract(token?.address)
  const addTransaction = useTransactionAdder()

  const approve = useCallback(async (): Promise<void> => {
    if (approvalState !== ApprovalState.NOT_APPROVED) {
      console.error('approve was called unnecessarily')
      return
    }
    // if (!token) {
    //   console.error('no token')
    //   return
    // }

    if (!vaultAddress) {
      console.error('no vault address')
      return
    }

    if (!vaultContract) {
      console.error('vaultContract is null')
      return
    }

    // if (!amountToApprove) {
    //   console.error('missing amount to approve')
    //   return
    // }

    if (!spender) {
      console.error('no spender')
      return
    }

    let useExact = false
    const estimatedGas = await vaultContract.estimateGas.approve(spender, MaxUint256).catch(() => {
      // general fallback for tokens who restrict approval amounts
      useExact = true
      return vaultContract.estimateGas.approve(spender, MaxUint256)
    })

    return vaultContract
      .approve(spender, MaxUint256, {
        gasLimit: calculateGasMargin(estimatedGas),
      })
      .then((response: TransactionResponse) => {
        addTransaction(response, {
          summary: 'Approve ' + 'vault',
          approval: { tokenAddress: vaultAddress, spender: spender },
        })
      })
      .catch((error: Error) => {
        console.debug('Failed to approve token', error)
        throw error
      })
  }, [approvalState, vaultAddress, vaultContract, spender, addTransaction])

  return [approvalState, approve]
}

// wraps useApproveCallback in the context of a swap
// export function useApproveCallbackFromTrade(
//   trade: V2Trade<Currency, Currency, TradeType> | V3Trade<Currency, Currency, TradeType> | undefined,
//   allowedSlippage: Percent
// ) {
//   const { chainId } = useActiveWeb3React()
//   const v3SwapRouterAddress = chainId ? SWAP_ROUTER_ADDRESSES[chainId] : undefined
//   const amountToApprove = useMemo(
//     () => (trade && trade.inputAmount.currency.isToken ? trade.maximumAmountIn(allowedSlippage) : undefined),
//     [trade, allowedSlippage]
//   )
//   return useApproveCallback(
//     amountToApprove,
//     chainId
//       ? trade instanceof V2Trade
//         ? V2_ROUTER_ADDRESS[chainId]
//         : trade instanceof V3Trade
//         ? v3SwapRouterAddress
//         : undefined
//       : undefined
//   )
// }
