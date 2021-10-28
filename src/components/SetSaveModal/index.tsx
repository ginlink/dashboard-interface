/*
 * @Author: jiangjin
 * @Date: 2021-09-19 13:50:55
 * @LastEditTime: 2021-09-27 17:44:51
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
  // onSubmit?: (currency: InputToken | undefined, price: string | undefined) => void
} & ModalProps) {
  const { account } = useActiveWeb3React()
  const addr = useTransactionAdder()

  const [price0, setPrice0] = useState<string | undefined>()
  const [price1, setPrice1] = useState<string | undefined>()
  // const [balance0, setBalance0] = useState<string | undefined>()
  // const [balance1, setBalance1] = useState<string | undefined>()

  const currency0 = useToken(address0)
  const currency1 = useToken(address1)

  const symbol = useMemo(() => {
    return `${currency0?.symbol}-${currency1?.symbol}`
  }, [currency0?.symbol, currency1])
  const symbol0 = useMemo(() => currency0?.symbol, [currency0?.symbol])
  const symbol1 = useMemo(() => currency1?.symbol, [currency1?.symbol])

  const amoutToApprove0 = useMemo(() => {
    if (!price0 || !currency0) return
    return CurrencyAmount.fromRawAmount(currency0, eth2wei(price0).toFixed(0))
  }, [currency0, price0])
  const amoutToApprove1 = useMemo(() => {
    if (!price1 || !currency1) return
    return CurrencyAmount.fromRawAmount(currency1, eth2wei(price1).toFixed(0))
  }, [currency1, price1])

  // console.log('[](amoutToApprove, vaultAddress):', amoutToApprove, vaultAddress)

  // 币种向金库授权
  const [approveState0, approveCallback0] = useApproveCallback(amoutToApprove0, vaultAddress)
  const [approveState1, approveCallback1] = useApproveCallback(amoutToApprove1, vaultAddress)

  const isApproved0 = useMemo(() => approveState0 === ApprovalState.APPROVED, [approveState0])
  const isApproved1 = useMemo(() => approveState1 === ApprovalState.APPROVED, [approveState1])

  // 修改价格时，去除按钮选中
  const setIndexRef0 = useRef<(index: number | undefined | null) => void>()
  const setIndexRef1 = useRef<(index: number | undefined | null) => void>()

  // 查询币种的balance
  const amount0 = useTokenBalance(account ?? undefined, currency0)?.toFixed()
  const amount1 = useTokenBalance(account ?? undefined, currency1)?.toFixed()

  // useEffect(() => {
  //   console.log('[SaveModal查询币种的balance](amount):', amount)
  //   setBalance(amount)
  // }, [amount])

  // 存款，注意区分单币和Lp存款的金库地址
  const vaultContract = useVaultContract(vaultAddress)
  const rewardContract = useRewardPoolContract(rewardAddress)
  const onSubmit = useCallback(async () => {
    console.log('[](存款):')
    // if (!vaultContract || !price || !rewardContract) return

    // const num = eth2wei(price).toFixed(0)
    // console.log('[金库](质押金额):', num)

    // try {
    //   const tx = await vaultContract.stake(num)
    //   addr(tx)

    //   onDismiss && onDismiss()
    // } catch (err) {
    //   console.error('[onSubmit](err):', err)
    // }
  }, [addr, onDismiss, rewardContract, vaultContract])

  // const [reward, setReward] = useState<string | undefined>()

  useEffect(() => {
    // console.log('[](reward):', reward)
    rewardContract?.rewardPerTokenStored().then((res) => {
      console.debug('[res]:', wei2eth(res?.toString())?.toFixed())
    })
  }, [rewardContract])

  // 控制按钮状态
  const isInputed0 = useMemo(() => price0 && price0.length > 0, [price0])
  const isInputed1 = useMemo(() => price1 && price1.length > 0, [price1])

  const isCorrect0 = useMemo(() => checkInputCorrent(price0, amount0), [amount0, price0])
  const isCorrect1 = useMemo(() => checkInputCorrent(price1, amount1), [amount1, price1])

  // 调试，查询状态
  // useEffect(() => {
  //   console.log('[](approveState, pair):', approveState, pair)
  // }, [approveState, pair])

  return (
    <Modal {...props} onDismiss={onDismiss}>
      <Wrapper>
        <ModalHeader title={symbol} onDismiss={onDismiss} />
        <Content>
          <InputTokenItem
            price={price0}
            balance={amount0}
            symbol={currency0?.symbol}
            currency0={currency0}
            onPriceChange={(value: string | undefined) => {
              console.log('[onPriceChange]:', value)

              try {
                validaInputValue(value)
              } catch (err: any) {
                return console.log('[](请输入正确数量):', err.message)
              }

              setPrice0(value)
              setIndexRef0.current?.(undefined)
            }}
            onPercentClick={(percent) => {
              if (!amount0) return

              const newPrice = new BigFloatNumber(amount0).multipliedBy(percent.value).toFixed()

              console.log('[onPercentClick](newPrice):', newPrice)

              setPrice0(newPrice)
            }}
            setIndexRef={setIndexRef0}
          />

          <InputTokenItem
            price={price1}
            balance={amount1}
            symbol={currency1?.symbol}
            currency0={currency1}
            onPriceChange={(value: string | undefined) => {
              console.log('[onPriceChange]:', value)

              try {
                validaInputValue(value)
              } catch (err: any) {
                return console.log('[](请输入正确数量):', err.message)
              }

              setPrice1(value)
              setIndexRef1.current?.(undefined)
            }}
            onPercentClick={(percent) => {
              if (!amount1) return

              const newPrice = new BigFloatNumber(amount1).multipliedBy(percent.value).toFixed()

              console.log('[onPercentClick](newPrice):', newPrice)

              setPrice1(newPrice)
            }}
            setIndexRef={setIndexRef1}
          />
        </Content>

        <ApproveWrapper>
          {!isApproved0 && approveState0 !== ApprovalState.UNKNOWN && (
            <ApproveButton className={'approveBtn'} onClick={() => approveCallback0().then()}>
              {approveState0 === ApprovalState.PENDING ? <Dots>授权{symbol0}</Dots> : `授权${symbol0}`}
            </ApproveButton>
          )}
          {!isApproved1 && approveState1 !== ApprovalState.UNKNOWN && (
            <ApproveButton className={'approveBtn'} onClick={() => approveCallback1().then()}>
              {approveState1 === ApprovalState.PENDING ? <Dots>授权{symbol1}</Dots> : `授权${symbol1}`}
            </ApproveButton>
          )}
        </ApproveWrapper>
        <ClaimButton
          onClick={() => onSubmit && onSubmit()}
          disabled={!isInputed0 || !isInputed1 || !isCorrect0 || !isCorrect1 || !isApproved0 || !isApproved1}
        >
          {price0 && isCorrect0 && price1 && isCorrect1 ? '存款到金库' : '请输入正确数量'}
          {/* {price && isCorrect ? '存款' : '请输入正确数量'} */}
        </ClaimButton>
      </Wrapper>
    </Modal>
  )
}
