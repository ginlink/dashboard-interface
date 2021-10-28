/*
 * @Author: jiangjin
 * @Date: 2021-09-18 23:18:34
 * @LastEditTime: 2021-09-27 16:02:36
 * @LastEditors: jiangjin
 * @Description:
 *
 */

import React, { useEffect, useState } from 'react'
import { MEDIUM } from '@/utils/adapteH5'
import { computeNumUnit } from '@/utils/formatNum'
import { lighten, darken } from 'polished'
import styled from 'styled-components/macro'
import { ButtonLight } from '../Button'
import CurrencyLogo from '../CurrencyLogo'
import DoubleCurrencyLogo from '../DoubleLogo'
import { InputBase } from '../Input'
import Row, { RowBetween } from '../Row'
import { Token } from '@uniswap/sdk-core'

const TokenInputWrapper = styled(Row)`
  padding: 7px 15px;
  background: ${(props) => lighten(0.05, props.theme.black)};
  box-shadow: 0px 1px 2px 0px rgba(9, 14, 22, 0.7);
  border-radius: 8px;

  align-items: center;
`
const PriceWrapper = styled(Row)`
  flex-direction: column;
  align-items: flex-end;

  margin-top: 5px;
  white-space: nowrap;
`
const Text = styled.span`
  font-size: 12px;
  line-height: 17px;
`
const PriceText = styled.span`
  font-size: 9px;
  color: ${(props) => props.theme.primary2};
  line-height: 13px;
`

const TokenPercentWrapper = styled(RowBetween)`
  margin-top: 11px;
  height: 30px;

  .button-active {
    color: ${({ theme }) => theme.primary1};
    border: 1px solid ${({ theme }) => lighten(0.1, theme.primary1)};
  }
`
const PercetButton = styled(ButtonLight)`
  width: 70px;

  background-color: ${(props) => lighten(0.02, props.theme.black)};
  color: ${(props) => darken(0.1, props.theme.white)};
  border: none;

  @media (max-width: ${MEDIUM}) {
    width: 64px;
  }
`
const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
`
const InputTokenItemWrapper = styled.div`
  margin-top: 20px;
`

export class InputToken extends Token {
  balance?: string
  price?: string
  savedBalance?: string

  constructor(
    chainId: number,
    address: string,
    decimals: number,
    symbol?: string,
    name?: string,
    balance?: string,
    savedBalance?: string,
    price?: string
  ) {
    super(chainId, address, decimals, symbol, name)

    this.balance = balance
    this.savedBalance = savedBalance
    this.price = price
  }
}

export interface Percent {
  value: string
  symbol: string
}

export const PERCENT_LIST: Percent[] = [
  { value: '0.25', symbol: '25%' },
  { value: '0.5', symbol: '50%' },
  { value: '0.75', symbol: '75%' },
  { value: '1', symbol: '100%' },
]

export function TokenPercent({
  onClick,
  setIndexRef,
}: {
  onClick?: (percent: Percent) => void
  index?: number | undefined | null
  setIndexRef?: React.MutableRefObject<((index: number | undefined | null) => void) | undefined>
}) {
  const [currIndex, setcurrIndex] = useState<number | undefined | null>()

  useEffect(() => {
    if (!setIndexRef) return

    setIndexRef.current = setcurrIndex
    // setIndexRef.current = (index: number | undefined | null) => setcurrIndex(index)
  }, [setIndexRef])

  return (
    <TokenPercentWrapper>
      {PERCENT_LIST.map((percent, index) => {
        return (
          <PercetButton
            key={index}
            className={currIndex === index ? 'button-active' : ''}
            onClick={() => {
              setcurrIndex(index)

              onClick && onClick(percent)
            }}
          >
            {percent.symbol}
          </PercetButton>
        )
      })}
    </TokenPercentWrapper>
  )
}

export function TokenInput({
  pair = false,
  price,
  balance,
  symbol,
  currency0,
  currency1,
  onPriceChange,
}: {
  pair?: boolean | undefined
  price: string | undefined
  balance: string | undefined
  symbol: string | undefined
  currency0: InputToken | undefined
  currency1?: InputToken | undefined
  onPriceChange: (value: string | undefined) => void
}) {
  console.log('[](pair):', pair)
  console.log('[](currency0, currency1):', currency0, currency1)

  return (
    <TokenInputWrapper>
      <LogoWrapper>
        {/* <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={16} /> */}
        {pair ? (
          <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={16} />
        ) : (
          <CurrencyLogo currency={currency0} size={'16px'} />
        )}
      </LogoWrapper>

      <InputBase value={price} onValueChange={onPriceChange} />
      {/* <InputBase price={price} /> */}
      <PriceWrapper>
        <Text>{symbol}</Text>
        <PriceText>
          Balance: {computeNumUnit(balance)} {symbol}
        </PriceText>
      </PriceWrapper>
    </TokenInputWrapper>
  )
}

export default function InputTokenItem({
  setIndexRef,
  onPercentClick,
  ...props
}: {
  pair?: boolean | undefined
  price: string | undefined
  balance: string | undefined
  symbol: string | undefined
  currency0: InputToken | undefined
  currency1?: InputToken | undefined
  onPriceChange: (value: string | undefined) => void
  onPercentClick?: (percent: Percent) => void
  setIndexRef?: React.MutableRefObject<((index: number | undefined | null) => void) | undefined>
}) {
  return (
    <InputTokenItemWrapper>
      <TokenInput {...props} />

      <TokenPercent onClick={onPercentClick} setIndexRef={setIndexRef} />
    </InputTokenItemWrapper>
  )
}
