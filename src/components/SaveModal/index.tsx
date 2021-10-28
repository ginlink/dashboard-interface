/*
 * @Author: jiangjin
 * @Date: 2021-09-19 13:50:55
 * @LastEditTime: 2021-09-27 17:45:10
 * @LastEditors: jiangjin
 * @Description:
 *
 */

import { useToken, useTokenBalance } from '@/hooks/token'
import { useRewardPoolContract, useVaultContract } from '@/hooks/useContract'
import { useActiveWeb3React } from '@/hooks/web3'
import { lighten } from 'polished'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components/macro'
import { ButtonFirst, ButtonLight } from '../Button'
import InputTokenItem, { InputToken } from '../InputTokenItem'
import Modal, { ModalHeader, ModalProps } from '../Modal'

import BigFloatNumber from 'bignumber.js'
import { RowBetween } from '../Row'
import { ApprovalState, useApproveCallback, useApproveCallbackWithVault } from '@/hooks/useApproveCallback'
import { CurrencyAmount, MaxUint256 } from '@uniswap/sdk-core'
import { checkInputCorrent, validaInputValue, currencys } from '../ClaimModal'
import Loader, { Dots } from '../Loader'
import { eth2wei, wei2eth } from '@/utils/numConvert'
import { useTransactionAdder } from '@/store/transaction/hooks'

const Wrapper = styled.div`
  padding: 20px 23px;

  min-width: 320px;
  max-width: 356px;

  @media (max-width: 320px) {
    min-width: 300px;
  }
`
const Content = styled.div`
  width: 100%;
`

const ClaimButton = styled(ButtonFirst)`
  width: 100%;
  font-size: 12px;
  color: ${(props) => lighten(0.05, props.theme.black)};
  line-height: 17px;
  margin-top: 15px;
`

const ApproveWrapper = styled(RowBetween)`
  gap: 7px;
  margin-top: 15px;
`

const ApproveButton = styled(ButtonLight)`
  width: 100%;
  border-radius: 32px;
`

export default function SaveModal({
  address0,
  address1,
  addressLp,
  vaultAddress,
  rewardAddress,
  onDismiss,
  // onSubmit,
  ...props
}: {
  vaultAddress: string | undefined
  rewardAddress: string | undefined
  address0: string | undefined
  address1?: string | undefined
  addressLp?: string | undefined
  // onSubmit?: (currency: InputToken | undefined, price: string | undefined) => void
} & ModalProps) {
  const { account } = useActiveWeb3React()
  const addr = useTransactionAdder()

  const [price, setPrice] = useState<string | undefined>()
  const [balance, setBalance] = useState<string | undefined>()

  const pair = useMemo(() => !!addressLp, [addressLp])

  const currency0 = useToken(address0)
  const currency1 = useToken(address1)
  const currencyLp = useToken(addressLp)

  const symbol = useMemo(() => {
    return currency1 ? `${currency0?.symbol}-${currency1?.symbol}` : currency0?.symbol
  }, [currency0?.symbol, currency1])

  const amoutToApprove = useMemo(() => {
    const currency = pair ? currencyLp : currency0

    if (!currency || !price) return

    return CurrencyAmount.fromRawAmount(currency, eth2wei(price).toFixed(0))
  }, [currency0, currencyLp, pair, price])

  console.log('[](amoutToApprove, vaultAddress):', amoutToApprove, vaultAddress)

  // 币种向金库、奖励池授权
  const [approveState, approveCallback] = useApproveCallback(amoutToApprove, vaultAddress)
  const [approveStateForReward, approveCallbackForReward] = useApproveCallback(amoutToApprove, rewardAddress)

  // 金库向奖励池授权
  // const [approveStateForReward, approveCallbackForReward] = useApproveCallbackWithVault(
  //   vaultAddress,
  //   rewardAddress
  // )

  // useEffect(() => {
  //   console.log('[](approveStateForReward):', approveStateForReward)
  //   if (approveStateForReward === ApprovalState.NOT_APPROVED) {
  //     approveCallbackForReward().then()
  //   }
  // }, [approveCallbackForReward, approveStateForReward])

  const isApproved = useMemo(() => approveState === ApprovalState.APPROVED, [approveState])
  const isNotApproved = useMemo(() => approveState === ApprovalState.NOT_APPROVED, [approveState])

  // 修改价格时，去除按钮选中
  const setIndexRef = useRef<(index: number | undefined | null) => void>()

  // 查询币种的balance
  const amount = useTokenBalance(account ?? undefined, pair ? currencyLp : currency0)?.toFixed()

  console.log('amount:', amount)
  console.log('currency0:', currency0)

  useEffect(() => {
    console.log('[SaveModal查询币种的balance](amount):', amount)
    setBalance(amount)
  }, [amount])

  // 存款，注意区分单币和Lp存款的金库地址
  const vaultContract = useVaultContract(vaultAddress)
  const rewardContract = useRewardPoolContract(rewardAddress)
  const onSubmit = useCallback(
    async (currency: InputToken | undefined, price: string | undefined) => {
      if (!vaultContract || !price || !rewardContract) return

      const num = eth2wei(price).toFixed(0)
      console.log('[金库](质押金额):', num)

      try {
        const tx = await vaultContract.stake(num)
        addr(tx)

        onDismiss && onDismiss()
      } catch (err) {
        console.error('[onSubmit](err):', err)
      }
    },
    [addr, onDismiss, rewardContract, vaultContract]
  )

  // const [reward, setReward] = useState<string | undefined>()

  useEffect(() => {
    // console.log('[](reward):', reward)
    rewardContract?.rewardPerTokenStored().then((res) => {
      console.debug('[res]:', wei2eth(res?.toString())?.toFixed())
    })
  }, [rewardContract])

  // 控制按钮状态
  const isInputed = useMemo(() => price && price.length > 0, [price])

  const isCorrect = useMemo(() => checkInputCorrent(price, balance), [balance, price])

  // 重置状态
  // useEffect(() => {
  //   return () => {
  //     App
  //   }
  // }, [vaultAddress])

  // 调试，查询状态
  useEffect(() => {
    console.log('[](approveState, pair):', approveState, pair)
  }, [approveState, pair])

  // 调试用 *************
  const onApproveForRewardPool = useCallback(async () => {
    await approveCallbackForReward()
  }, [approveCallbackForReward])

  const onStake = useCallback(
    async (currency: InputToken | undefined, price: string | undefined) => {
      if (!rewardContract || !account || !price) return

      const num = eth2wei(price).toFixed(0)

      console.log('[质押到奖励池](质押金额):', num)

      try {
        // 质押到奖励池
        // rewardContract.balanceOf(account).then((res) => {
        //   console.log('[balanceOf](res):', res)
        // })

        const tx = await rewardContract.stake(num)
        addr(tx)
      } catch (err) {
        console.error('[onStake](err):', err)
      }
    },
    [account, addr, rewardContract]
  )

  const onWithdrawFromRewardPool = useCallback(async () => {
    if (!account || !rewardContract) return

    const savedNum = (await rewardContract?.balanceOf(account))?.toString()
    if (!savedNum) return

    const tx = await rewardContract.withdraw(savedNum)
    addr(tx)
  }, [account, addr, rewardContract])
  // 调试用 ************* END
  return (
    <Modal {...props} onDismiss={onDismiss}>
      <Wrapper>
        <ModalHeader title={symbol} onDismiss={onDismiss} />
        <Content>
          <InputTokenItem
            pair={pair}
            price={price}
            balance={balance}
            symbol={symbol}
            currency0={currency0}
            currency1={currency1}
            onPriceChange={(value: string | undefined) => {
              console.log('[onPriceChange]:', value)

              try {
                validaInputValue(value)
              } catch (err: any) {
                return console.log('[](请输入正确数量):', err.message)
              }

              setPrice(value)
              setIndexRef.current?.(undefined)
            }}
            onPercentClick={(percent) => {
              if (!balance) return

              const newPrice = new BigFloatNumber(balance).multipliedBy(percent.value).toFixed()

              console.log('[onPercentClick](newPrice):', newPrice)

              setPrice(newPrice)
            }}
            setIndexRef={setIndexRef}
          />
        </Content>

        <ApproveWrapper>
          {!isApproved && approveState !== ApprovalState.UNKNOWN && (
            <ApproveButton className={'approveBtn'} onClick={() => approveCallback().then()}>
              {approveState === ApprovalState.PENDING ? <Dots>授权{symbol}</Dots> : '授权'}

              {/* {approveState === ApprovalState.PENDING && <Loader />} */}
            </ApproveButton>
          )}
        </ApproveWrapper>
        <ClaimButton
          onClick={() => onSubmit && onSubmit(pair ? currencyLp : currency0, price)}
          disabled={!isInputed || !isCorrect || !isApproved}
        >
          {price && isCorrect ? '存款到金库' : '请输入正确数量'}
          {/* {price && isCorrect ? '存款' : '请输入正确数量'} */}
        </ClaimButton>
        <ClaimButton onClick={() => onApproveForRewardPool && onApproveForRewardPool()}>授权给奖励池</ClaimButton>
        <ClaimButton onClick={() => onStake && onStake(pair ? currencyLp : currency0, price)}>质押到奖励池</ClaimButton>
        <ClaimButton onClick={() => onWithdrawFromRewardPool && onWithdrawFromRewardPool()}>取款从奖励池</ClaimButton>
      </Wrapper>
    </Modal>
  )
}
