import { useToken } from '@/hooks/token'
import { MEDIUM, px2vwm } from '@/utils/adapteH5'
import React, { useCallback } from 'react'
import styled, { useTheme } from 'styled-components/macro'
import ButtonComponent from '../ButtonComponents'
import DoubleCurrencyComponent from '../DoubleCurrencyComponent'
import TooltipComponent from '../ToolTipComponent'

const PositionCardItemWarpper = styled.div`
  max-width: 253px;
  background: #0e192c;
  box-shadow: 0px 1px 2px 0px rgba(9, 14, 22, 0.5);
  border-radius: 15px;
  padding: 18px;
  .publicStyle {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
  }
  .publicStyle:first-child {
    margin-top: 18px;
  }
  button {
    width: 100%;
    margin: 19px 0 12px 0;
  }
  .contentStyle {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 18px;
  }

  @media (max-width: ${MEDIUM}) {
    max-width: unset;
  }
`
const AprBox = styled.div``
const StakedBox = styled.div``
const RewardBox = styled.div``
const Title = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: ${(props) => props.theme.text10};
`
const Value = styled.div`
  font-size: 14px;
  font-weight: bold;
  color: ${(props) => props.theme.white};
`
const AprValue = styled.div`
  font-size: 15px;
  font-weight: bold;
  color: ${(props) => props.theme.text11};
`
const BottomBtnBox = styled.div`
  display: flex;
  justify-content: space-between;
  button {
    width: 50%;
    margin: 0;
  }
  button:first-child {
    margin-right: 14px;
  }
  @media (max-width: ${MEDIUM}) {
    button:first-child {
      margin-right: ${px2vwm('15px')};
    }
  }
`
interface PositionCardItemInterface {
  item: any
  type: string
  tip: string
  deposit: () => void
  receive: () => void
  withdraw: () => void
}
export default function PositionCardItem({ item, type, tip, deposit, receive, withdraw }: PositionCardItemInterface) {
  console.log(item)
  const depositFn = useCallback(() => {
    deposit()
  }, [])
  const receiveFn = useCallback(() => {
    receive()
  }, [])
  const withdrawFn = useCallback(() => {
    withdraw()
  }, [])
  const currency0 = useToken(item.token0)
  const currency1 = useToken(item.token1)
  return (
    <PositionCardItemWarpper>
      <DoubleCurrencyComponent
        type={type}
        currency0={currency0}
        currency1={currency1}
        lp_name={item.lp_name}
        tip={tip}
      ></DoubleCurrencyComponent>
      <AprBox className="publicStyle">
        <Title>APY</Title>
        <AprValue>
          <span>{item.apy}</span>% <TooltipComponent text={'apy内容待定'}></TooltipComponent>
        </AprValue>
      </AprBox>
      <StakedBox className="publicStyle">
        <Title>已存</Title>
        <Value>${item.staked}</Value>
      </StakedBox>
      <RewardBox className="publicStyle">
        <Title>奖励</Title>
        <Value>{item.reward} CON</Value>
      </RewardBox>
      <ButtonComponent btnName={'存款'} clickBtn={depositFn}></ButtonComponent>
      <BottomBtnBox>
        <ButtonComponent btnName={'领取'} backgroundColor={'#0E192C'} clickBtn={receiveFn}></ButtonComponent>
        <ButtonComponent btnName={'取款'} backgroundColor={'#0E192C'} clickBtn={withdrawFn}></ButtonComponent>
      </BottomBtnBox>
    </PositionCardItemWarpper>
  )
}
