/*
 * @Author: jiangjin
 * @Date: 2021-09-02 17:03:56
 * @LastEditTime: 2021-09-27 17:45:17
 * @LastEditors: jiangjin
 * @Description:
 *  聚合流动性挖矿取款modal
 */

import React, { useMemo } from 'react'
import styled from 'styled-components/macro'

import Modal, { ModalHeader, ModalProps } from '../Modal'
import Row, { RowBetween } from '../Row'
import { ButtonFirst } from '../Button'
import { computeNumUnit } from '@/utils/formatNum'
import SingleLogo from '../SingleLogo'
import { WrappedTokenInfo } from '@/types/wrappedTokenInfo'
import { useToken } from '@/hooks/token'
import BigFoaltNumber from 'bignumber.js'

const Wrapper = styled.div`
  padding: 20px 23px;

  font-weight: 500;

  min-width: 356px;
  max-width: 356px;
`
const Header = styled(RowBetween)`
  svg {
    cursor: pointer;
  }
`
const Name = styled.div`
  font-size: 15px;
  line-height: 21px;
`
const Content = styled.div`
  width: 100%;
  padding: 30px 23px;
`

const TokenItemWrapper = styled(Row)`
  margin-top: 30px;
  &:first-child {
    margin-top: 0;
  }
`

const TokenInfo = styled(Row)`
  flex-direction: column;
  align-items: flex-start;

  margin-left: 7px;
`

const Title = styled.div`
  font-size: 11px;
  color: #8391a8;
  line-height: 15px;
`
const Value = styled.div`
  font-size: 17px;
  font-weight: bold;
  line-height: 21px;
`
const ClaimButton = styled(ButtonFirst)`
  /* background: #ffab36;
  border-radius: 32px;
  height: 35px;
  width: 100%; */

  width: 100%;
  font-size: 12px;
  color: #131d32;
  line-height: 17px;
`

function SavedTokenItem({
  currency,
  balance,
  price,
}: {
  currency: WrappedTokenInfo | undefined
  balance: string | undefined
  price: string | undefined
}) {
  return (
    <TokenItemWrapper>
      <SingleLogo currency={currency} />
      <TokenInfo>
        <Title>已存</Title>
        <Value>{`${computeNumUnit(balance)} ${currency?.symbol} ($${computeNumUnit(price)})`}</Value>
      </TokenInfo>
    </TokenItemWrapper>
  )
}

export default function SetClaimModal({
  address0,
  address1,
  vaultAddress,
  onDismiss,
  ...props
}: {
  vaultAddress: string | undefined
  address0: string | undefined
  address1?: string | undefined
} & ModalProps) {
  const currency0 = useToken(address0)
  const currency1 = useToken(address1)

  const title = useMemo(() => {
    return `${currency0?.symbol}-${currency1?.symbol}`
  }, [currency0?.symbol, currency1])

  // TODO 从金库中查询存入的balance
  const balance0 = useMemo(() => '99999', [])
  const balance1 = useMemo(() => '99999', [])

  // TODO 通过数量去计算price
  const price0 = useMemo(() => '0', [])
  const price1 = useMemo(() => '0', [])

  const isInputed = useMemo(() => {
    const bigPrice0 = new BigFoaltNumber(price0)
    const bigPrice1 = new BigFoaltNumber(price1)

    return bigPrice0.gt(0) || bigPrice1.gt(0)
  }, [price0, price1])

  return (
    <Modal {...props} onDismiss={onDismiss}>
      <Wrapper>
        <ModalHeader title={title} onDismiss={onDismiss} />
        <Content>
          <SavedTokenItem currency={currency0} balance={balance0} price={price0} />
          <SavedTokenItem currency={currency1} balance={balance1} price={price1} />
        </Content>
        <ClaimButton disabled={!isInputed}>取款</ClaimButton>
      </Wrapper>
    </Modal>
  )
}
