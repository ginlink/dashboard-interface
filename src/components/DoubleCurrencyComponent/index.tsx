import { collapseTypes } from '@/constants/collapseType'
import React from 'react'
import styled from 'styled-components/macro'
import DoubleCurrencyLogo from '../DoubleLogo'
import SingleLogo from '../SingleLogo'
import jian from '../../assets/images/publicImg/icon-dui.svg'
import { MEDIUM, px2vwm } from '@/utils/adapteH5'
import { WrappedTokenInfo } from '@/types/wrappedTokenInfo'

interface Currency {
  address: string
}
interface DoubleCurrencyInterface {
  type: string
  currency0: WrappedTokenInfo | undefined
  currency1: WrappedTokenInfo | undefined
  lp_name: string
  tip?: string
  isTransverse?: boolean
}
const Box = styled.div`
  .symbol-name-style {
    margin-left: 6px;
  }
  .single-style {
    display: flex;
  }
`
const SingleCoin = styled.div<{ isTransverse?: boolean }>`
  display: ${({ isTransverse }) => (isTransverse ? 'flex' : '')};
  align-items: center;
`
const SymbolName = styled.div`
  font-size: 14px;
  color: ${(props) => props.theme.white};
`
const LiquidityMiningBox = styled.div`
  display: flex;
  align-items: center;
`
const SymbolBox = styled.div`
  margin-left: 6px;
`
const SymbolDetail = styled.div`
  font-size: 11px;
  color: #bdc8da;
  margin-top: 4px;
  display: flex;
  align-items: center;
  img {
    width: 14px;
    height: 6px;
    margin: 0 2px;
  }
`
const PolymerizationFluidity = styled.div`
  flex-direction: column;
`
const SymbolAndLogo = styled.div`
  display: flex;
  align-items: center;
`
export default function DoubleCurrencyComponent({
  type,
  currency0,
  currency1,
  lp_name,
  tip,
  isTransverse = false,
}: DoubleCurrencyInterface) {
  console.log('type', type)
  return (
    <Box>
      {type === collapseTypes.singleCoin ? (
        <SingleCoin isTransverse={isTransverse} className={'contentStyle'}>
          <SingleLogo currency={currency0}></SingleLogo>
          <SymbolName className={'symbol-name-style'}>{lp_name}</SymbolName>
        </SingleCoin>
      ) : type === collapseTypes.liquidityMining ? (
        <LiquidityMiningBox className={'contentStyle' + ' ' + 'symbol-logo-style'}>
          <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={22} />
          <SymbolBox>
            <SymbolName>{lp_name}</SymbolName>
            {tip && <SymbolDetail>{tip}</SymbolDetail>}
          </SymbolBox>
        </LiquidityMiningBox>
      ) : (
        <PolymerizationFluidity className={'contentStyle'}>
          <SymbolAndLogo className={'symbol-logo-style'}>
            <DoubleCurrencyLogo currency0={'currency0'} currency1={'currency1'} size={22} />
            <SymbolName className={'symbol-name-style'}>{lp_name}</SymbolName>
          </SymbolAndLogo>
          <SymbolDetail>
            ETH Range:1.4K
            <img src={jian} alt="" />
            2.4K
          </SymbolDetail>
        </PolymerizationFluidity>
      )}
    </Box>
  )
}
