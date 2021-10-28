/*
 * @Author: jiangjin
 * @Date: 2021-09-07 17:22:07
 * @LastEditTime: 2021-09-09 13:07:58
 * @LastEditors: jiangjin
 * @Description:
 *
 */
import { collapseTypes } from '@/constants/collapseType'
import { MEDIUM } from '@/utils/adapteH5'
import React from 'react'
import styled from 'styled-components/macro'
import DoubleCurrencyLogo from '../DoubleLogo'
import SingleLogo from '../SingleLogo'

const PositionCardWarpper = styled.div`
  width: 138px;
  background: ${(props) => props.theme.bg13};
  box-shadow: 0px 1px 2px 0px ${(props) => props.theme.boxShadow3};
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 15px;
  margin-right: 20px;
  /* margin-bottom: 17px; */
  @media (max-width: ${MEDIUM}) {
    width: 95px;

    /* margin-right: 20px; */
    margin-right: unset;
    padding: 12px;
  }
`
const LpNameBox = styled.div`
  font-size: 15px;
  color: ${(props) => props.theme.white};
  margin-top: 11px;
  @media (max-width: ${MEDIUM}) {
    font-size: 13px;
    margin-top: 6px;
  }
`
const AprBox = styled.div`
  margin-top: 11px;
  span:first-child {
    font-size: 14px;
    color: ${(props) => props.theme.text8};
    margin-right: 14px;
  }
  span:nth-child(2) {
    font-size: 18px;
    font-weight: bold;
    color: ${(props) => props.theme.text11};
  }
  @media (max-width: ${MEDIUM}) {
    margin-top: 6px;
    span:first-child {
      font-size: 11px;
      margin-right: 6px;
    }
    span:nth-child(2) {
      font-size: 14px;
    }
  }
`
interface PositionCardInterface {
  type: string
  currency: any
  item: any
}
const ImgBox = styled.div<{ isShowStyle: boolean }>`
  margin-left: ${({ isShowStyle }) => (isShowStyle ? '0' : '11px')};
`
export default function PositionCard({ type, currency, item }: PositionCardInterface) {
  return (
    <PositionCardWarpper>
      <ImgBox isShowStyle={type === collapseTypes.singleCoin}>
        {type === collapseTypes.singleCoin ? (
          <SingleLogo currency={currency}></SingleLogo>
        ) : (
          <DoubleCurrencyLogo currency0={'currency0'} currency1={'currency1'} size={22} />
        )}
      </ImgBox>
      <LpNameBox>{item.lp_name}</LpNameBox>
      <AprBox>
        <span>APR</span>
        <span>2{item.apr}%</span>
      </AprBox>
    </PositionCardWarpper>
  )
}
