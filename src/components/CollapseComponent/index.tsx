import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Collapse } from 'antd'
import styled from 'styled-components/macro'
import { ExternalLink } from '@/theme'
import jian from '../../assets/images/publicImg/jian.svg'
import { collapseTypes } from '@/constants/collapseType'
import RewardInfo from './RewardInfo'
import StakeInfo from './StakeInfo'
import TooltipComponent from '../ToolTipComponent'
import test1 from '../../assets/images/publicImg/test1.svg'
import test2 from '../../assets/images/publicImg/test2.png'
import con from '../../assets/images/publicImg/con.svg'
import DoubleCurrencyComponent from '../DoubleCurrencyComponent'
import { computeNumUnit } from '@/utils/formatNum'
import { useToken, useTokenBalance } from '@/hooks/token'
import { useActiveWeb3React } from '@/hooks/web3'
import { DataListBase } from '@/mock'
import { WrappedTokenInfo } from '@/types/wrappedTokenInfo'
import EarnComponent from '../EarnComponent'
const { Panel } = Collapse
const StakeInfoBox = styled.div`
  width: 100%;
  padding: 23px;
  background: #0e192c;
  box-shadow: 0px 1px 2px 0px rgba(9, 14, 22, 0.5);
  border-radius: 15px;
  display: flex;
`
const MyExternalLink = styled(ExternalLink)`
  font-size: 11px;
  color: ${(props) => props.theme.text8};
  text-decoration: none;
  &:hover {
    text-decoration: none;
  }
`
const LinkBox = styled.div`
  text-align: right;
  margin-top: 12px;
`
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  .contentStyle {
    padding-left: 11px;
    display: flex;
    align-items: center;
  }
  .symbol-name-style {
    margin-left: 6px;
  }
`
const Item = styled.div``
const Title = styled.div`
  font-size: 11px;
  font-weight: 500;
  color: #8391a8;
`
const AprContent = styled.div`
  font-size: 14px;
  font-weight: bold;
  color: #00b594;
`
const EarnContent = styled.div<{ marginLeft: number }>`
  margin-left: ${({ marginLeft }) => '-' + marginLeft + 'px'};
`
const Content = styled.div`
  font-size: 14px;
  font-weight: bold;
  color: #ffffff;
`

const Warpper = styled.div`
  .ant-collapse {
    max-width: 825px !important;
    background: #162133 !important;
    box-shadow: 0px 2px 26px 0px rgba(12, 23, 41, 1) !important;
    border-radius: 15px !important;
    padding: 0;
    margin-bottom: 18px !important;
    border: 0 !important;
  }
  .ant-collapse-item:last-child > .ant-collapse-content {
    border-radius: 0 0 15px 15px !important;
    background: #162133;
    border-top: 0;
  }
  .ant-layout-content {
    background: #0c1626 !important;
  }

  .ant-collapse > .ant-collapse-item {
    border-bottom: 0 !important;
  }

  .ant-collapse {
    width: 100%;
  }
  .anticon {
    color: #8391a8;
  }
`
interface Currency {
  address: string
}
interface CollapseInterface {
  item: DataListBase
  type: string
  propActiveKey?: any
  lp_name?: string | undefined
  balance?: string | undefined
  isStake?: boolean

  changeActiveKey: (key: any) => void
  deposit: () => void
  withdraw: () => void
}
export default function CollapseComponent({
  item,
  type,
  propActiveKey,
  lp_name,
  balance,
  isStake = false,
  changeActiveKey,
  deposit,
  withdraw,
}: CollapseInterface) {
  function getHeader(currency0: WrappedTokenInfo | undefined, currency1: WrappedTokenInfo | undefined) {
    return (
      <Header>
        <DoubleCurrencyComponent
          type={type}
          currency0={currency0}
          currency1={currency1}
          lp_name={lp_name || ''}
          tip={'Pancake'}
        ></DoubleCurrencyComponent>
        <Item>
          <Title>APR</Title>
          <AprContent>
            {item.apr}% <TooltipComponent text={'APR内容待定'}></TooltipComponent>
          </AprContent>
        </Item>
        <Item>
          <Title>赚取</Title>
          {type === collapseTypes.singleCoin ? (
            <EarnContent marginLeft={6}>
              <EarnComponent size={17} imgAddresses={[currency0]}></EarnComponent>
            </EarnContent>
          ) : (
            <EarnContent marginLeft={12}>
              <EarnComponent size={17} imgAddresses={[currency0, currency1]}></EarnComponent>
            </EarnContent>
          )}
        </Item>
        <Item>
          <Title>锁仓量($)</Title>
          <Content>{computeNumUnit(item.total_tvl)}</Content>
        </Item>
        <Item>
          <Title>余额</Title>
          <Content>
            {computeNumUnit(balance)} {lp_name}
          </Content>
        </Item>
      </Header>
    )
  }
  const changeCollapse = useCallback(
    (params: any) => {
      changeActiveKey(params)
    },
    [changeActiveKey]
  )

  const depositFn = useCallback(() => {
    deposit()
  }, [])
  const withdrawFn = useCallback(() => {
    withdraw()
  }, [])
  const currency0 = useToken(item.token0)
  const currency1 = useToken(item.token1)
  return (
    <Warpper>
      <Collapse
        defaultActiveKey={propActiveKey}
        activeKey={propActiveKey}
        onChange={changeCollapse}
        expandIconPosition={'right'}
      >
        <Panel header={getHeader(currency0, currency1)} key={item.id}>
          <StakeInfoBox>
            <RewardInfo rewardAddr={item.reward_pool}></RewardInfo>
            <StakeInfo withdraw={withdrawFn} deposit={depositFn} type={type} item={item} isStake={isStake}></StakeInfo>
          </StakeInfoBox>
          {type === collapseTypes.liquidityMining && (
            <LinkBox>
              <MyExternalLink href={'http://www.baidu.com'}>
                获取 {lp_name} LP <img src={jian} alt="" />
              </MyExternalLink>
            </LinkBox>
          )}
        </Panel>
      </Collapse>
    </Warpper>
  )
}
