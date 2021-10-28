import React from 'react'
import styled from 'styled-components/macro'
import DoubleCurrencyComponent from '../DoubleCurrencyComponent'
import TooltipComponent from '../ToolTipComponent'
import { collapseTypes } from '@/constants/collapseType'
import { px2vwm } from '@/utils/adapteH5'
import EarnComponent from '../EarnComponent'
import { computeNumUnit } from '@/utils/formatNum'
import { DataListBase } from '@/mock'
import { useToken } from '@/hooks/token'
const Warpper = styled.div`
  .symbol-logo-style {
    margin-left: ${px2vwm('11px')};
  }
`
const ContentBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${px2vwm('12px')};
`
const Title = styled.div`
  font-size: ${px2vwm('13px')};
  font-weight: 400;
  color: ${(props) => props.theme.text10};
`
const AprValue = styled.div`
  display: flex;
  align-items: center;
  font-size: ${px2vwm('16px')};
  font-weight: bold;
  color: ${(props) => props.theme.text11};
  span {
    margin-right: ${px2vwm('5px')};
  }
`
const DefaultValue = styled.div`
  font-size: ${px2vwm('14px')};
  font-weight: bold;
  color: ${(props) => props.theme.white};
`
const EarnContent = styled.div`
  div {
    position: relative;
  }
  img {
    width: ${px2vwm('17px')};
    height: ${px2vwm('17px')};
    position: relative;
  }
`
interface PositionHeaderCardInterface {
  type: string
  item: DataListBase
  balance?: string | undefined
  lp_name?: string | undefined
}

export default function PositionHeaderCardH5({ type, item, balance, lp_name }: PositionHeaderCardInterface) {
  const currency0 = useToken(item.token0)
  const currency1 = useToken(item.token1)
  return (
    <Warpper>
      <DoubleCurrencyComponent
        isTransverse={type === collapseTypes.singleCoin ? true : false}
        type={type}
        currency0={currency0}
        currency1={currency1}
        lp_name={lp_name || ''}
        tip={'Pancake'}
      ></DoubleCurrencyComponent>
      <ContentBox>
        <Title>APR</Title>
        <AprValue>
          <span>{item.apr}%</span>
          <TooltipComponent text={<span>APR内容待定</span>}></TooltipComponent>
        </AprValue>
      </ContentBox>
      <ContentBox>
        <Title>赚取</Title>
        <EarnContent>
          {type === collapseTypes.singleCoin ? (
            <EarnComponent imgAddresses={[currency0]}></EarnComponent>
          ) : (
            <EarnComponent imgAddresses={[currency0, currency1]}></EarnComponent>
          )}
        </EarnContent>
      </ContentBox>
      <ContentBox>
        <Title>锁仓量($)</Title>
        <DefaultValue>{computeNumUnit(item.total_tvl)}</DefaultValue>
      </ContentBox>
      <ContentBox>
        <Title>余额</Title>
        <DefaultValue>
          {computeNumUnit(balance)} {lp_name}
        </DefaultValue>
      </ContentBox>
    </Warpper>
  )
}
