/*
 * @Author: jiangjin
 * @Date: 2021-09-18 23:16:25
 * @LastEditTime: 2021-09-27 17:45:01
 * @LastEditors: jiangjin
 * @Description:
 *
 */

import {
  BTC_ADDRESS,
  BUSD_ADDRESS,
  BUSD_SPC_ADDRESS,
  CON_ADDRESS,
  SPC_ADDRESS,
  VAUL_BUSD_SPC_ADDRESS,
} from '@/constants/token'
import { useTokenBalance } from '@/hooks/token'
import { useVaultContract } from '@/hooks/useContract'
import { useActiveWeb3React } from '@/hooks/web3'
import { lighten } from 'polished'
import { title } from 'process'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components/macro'
import { ButtonFirst, ButtonLight } from '../Button'
import InputTokenItem, { InputToken } from '../InputTokenItem'
import Modal, { ModalHeader, ModalProps } from '../Modal'

import BigFloatNumber from 'bignumber.js'
import { Result, useSingleCallResult } from '@/store/multicall/hooks'
import { BigNumber } from '@ethersproject/bignumber'
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

const ApproveButton = styled(ButtonLight)`
  width: 100%;
  border-radius: 32px;
`

export const currencys: {
  [address: string]: InputToken
} = {
  [BUSD_ADDRESS]: new InputToken(97, BUSD_ADDRESS, 18, 'BUSD'),
  [CON_ADDRESS]: new InputToken(97, CON_ADDRESS, 18, 'CON'),
  [BTC_ADDRESS]: new InputToken(97, BTC_ADDRESS, 18, 'BTC'),
  [SPC_ADDRESS]: new InputToken(97, SPC_ADDRESS, 18, 'SPC'),

  [BUSD_SPC_ADDRESS]: new InputToken(97, BUSD_SPC_ADDRESS, 18, 'BUSD-SPC'),
}

export function checkInputCorrent(price: string | undefined, balance: string | undefined) {
  if (!price || price == '0' || price == '0.' || !balance) return false

  return new BigFloatNumber(price).lte(balance)
}
export function validaInputValue(value: string | undefined) {
  if (value) {
    // 只要数字和小数点
    if (!value.match(/^[\d\.]+$/g)) throw new Error('只要数字和小数点')

    // 只要一个小数点
    const hasOnlyOnePoint = value.match(/\./g)
    if (hasOnlyOnePoint && hasOnlyOnePoint.length > 1) throw new Error('只要一个小数点')
  }
}
export function checkCorrect(token: InputToken | undefined) {
  console.log('[checkCorrect](token):', token)

  if (!token) return false
  if (!token.balance || !token.price) return false

  // balance需大于或者等于price
  return new BigFloatNumber(token.balance).gte(token.price)
}

export default function ClaimModal({
  vaultAddress,
  address0,
  address1,
  addressLp,
  onDismiss,
  // onSubmit,
  ...props
}: {
  vaultAddress: string | undefined
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

  const currency0: InputToken | undefined = currencys[address0 ?? '']
  const currency1: InputToken | undefined = currencys[address1 ?? '']
  const currencyLp: InputToken | undefined = currencys[addressLp ?? '']

  const symbol = useMemo(
    () => (pair ? currencyLp?.symbol : currency0?.symbol),
    [currency0?.symbol, currencyLp?.symbol, pair]
  )

  // 查询金库中的balance
  const vaultContract = useVaultContract(vaultAddress)
  const amount = useTokenBalance(account ?? undefined, pair ? currencyLp : currency0)?.toFixed()

  const inputs = useMemo(() => [account ?? undefined], [account])
  const balanceResult = useSingleCallResult(vaultContract, 'balanceOf', inputs)
  useEffect(() => {
    const balance = balanceResult.result?.[0] as BigNumber | undefined

    console.log('[](balance):', balance?.toString())

    setBalance(wei2eth(balance)?.toFixed())
  }, [amount, balanceResult.result])

  // 获取
  const onSubmit = useCallback(async () => {
    if (!price || !vaultContract) return

    // await vaultContract?.withdrawAll()
    // await vaultContract?.withdraw(eth2wei(10).toFixed())

    // 注意：在具有除法的运算中，结果可能有小数
    const amount = eth2wei(price).toFixed(0)
    // 向下取整，因为etherjs的BigNumber是向下取整，如下：
    // console.log('[div]:', BigNumber.from('124').div(3).toString())

    console.log('[amount](赎回):', eth2wei(price).toFixed(), amount)

    try {
      const tx = await vaultContract.withdraw(amount)
      addr(tx)

      onDismiss && onDismiss()
    } catch (err) {
      console.log('[onSubmit](err):', err)
    }
  }, [addr, onDismiss, price, vaultContract])

  // 修改价格时，去除按钮选中
  const setIndexRef = useRef<(index: number | undefined | null) => void>()

  // 控制按钮状态
  const isInputed = useMemo(() => price && price.length > 0, [price])

  const isCorrect = useMemo(() => checkInputCorrent(price, balance), [balance, price])

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

              console.log('[](newPrice):', eth2wei(newPrice).toFixed(), eth2wei(newPrice).toFixed(0))

              setPrice(newPrice)
            }}
            setIndexRef={setIndexRef}
          />
        </Content>
        <ClaimButton
          // onClick={() => onSubmit && onSubmit(pair ? currencyLp : currency0, price)}
          disabled={!isInputed || !isCorrect}
          onClick={onSubmit}
        >
          {price && !isCorrect ? '请输入正确数量' : '获取'}
        </ClaimButton>
      </Wrapper>
    </Modal>
  )
}
