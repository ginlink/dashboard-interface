/*
 * @Author: jiangjin
 * @Date: 2021-09-16 10:17:56
 * @LastEditTime: 2021-09-16 10:25:03
 * @LastEditors: jiangjin
 * @Description:
 *
 */

import LoadingModel from '@/components/OperationModel/LoadingModel'
import { TransactionErrorContent, TransactionSubmittedContent } from '@/components/TransactionConfirmationModal'
import { useActiveWeb3React } from '@/hooks/web3'
import { Currency } from '@/plugins/@uniswap/sdk-core/dist'
import React, { memo, useState, useMemo, useCallback } from 'react'
import { CurrencyAmount, MaxUint256, Token } from 'plugins/@uniswap/sdk-core/dist'
import { useTokenContract } from '@/hooks/useContract'
function TestTransactionModal() {
  const [open, setOpen] = useState(true)
  const [openSub, setOpenSub] = useState(true)
  const [errorOpen, setErrorOpen] = useState(true)
  const [errorMsg, setErrorMsg] = useState('MetaMask Tx Signature: User denied transaction signature.')
  const { chainId, account } = useActiveWeb3React()

  // return <LoadingModel isOpen={open} onDismiss={() => setOpen((pre) => !pre)}></LoadingModel>
  const temp = {} as Currency
  return errorOpen ? (
    <TransactionErrorContent isOpen={errorOpen} onDismiss={() => setErrorOpen(false)} message={errorMsg} />
  ) : (
    // <LoadingModel isOpen={open} onDismiss={() => setOpen((pre) => !pre)}></LoadingModel>
    <TransactionSubmittedContent
      chainId={chainId ?? 97}
      hash={'111111'}
      onDismiss={() => setErrorOpen(true)}
      currencyToAdd={temp}
      isOpen={openSub}
    />
  )
}

export default memo(TestTransactionModal)
