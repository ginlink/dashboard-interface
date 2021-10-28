/*
 * @Author: your name
 * @Date: 2021-09-01 17:31:36
 * @LastEditTime: 2021-09-18 17:39:49
 * @LastEditors: jiangjin
 * @Description: In User Settings Edit
 * @FilePath: /converter-bsc-web/src/components/CollapseComponent/StakeInfo.tsx
 */
import React from 'react'
import styled from 'styled-components/macro'
import ButtonComponent from '../ButtonComponents'
import { collapseTypes } from '@/constants/collapseType'
import SingleLogo from '../SingleLogo'
import DoubleCurrencyLogo from '../DoubleLogo'
import { MEDIUM, px2vwm } from '@/utils/adapteH5'
import { useIsPcByScreenWidth } from '@/hooks/useIsPc'
const StakedBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const UnStakedBox = styled.div`
  display: flex;
  justify-content: space-between;
  height: 100%;
  align-items: center;
`
const Box = styled.div`
  width: 50%;
  @media (max-width: ${MEDIUM}) {
    width: 100%;
  }
`
const StakedContent = styled.div<{ isTransverse?: boolean }>`
  max-width: ${({ isTransverse }) => (isTransverse ? px2vwm('128px') : 'unset')};
`
const StakedTitle = styled.div`
  font-size: 9px;
  font-weight: 500;
  color: ${(props) => props.theme.text10};
`
const StakedValue = styled.div`
  font-size: 14px;
  font-weight: bold;
  color: ${(props) => props.theme.white};
  span {
    font-size: 12px;
    font-weight: 600;
    color: ${(props) => props.theme.text8};
  }
`
const StakedTip = styled.div`
  font-size: 11px;
  font-weight: 600;
  color: ${(props) => props.theme.text8};
`
const StakedBtn = styled.div`
  display: flex;
  flex-direction: column;
`
const PolWarpper = styled.div`
  width: 100%;
  .pol-box-style {
    margin-bottom: 18px;
  }
`
const PolBox = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  div:first-child {
    display: flex;
    align-items: center;
  }
`
const StakeItem = styled.div``
const LpImgs = styled.div<{ isShowWidth?: boolean }>`
  width: ${({ isShowWidth }) => (isShowWidth ? '100%' : 'unset')};
  display: flex;
  align-items: center;
  padding-left: 23px;
  @media (max-width: ${MEDIUM}) {
    padding-left: 0px;
  }
  img {
    width: 23px;
    height: 23px;
    position: relative;
    z-index: 3;
  }
  img:nth-child(2) {
    left: -4px;
    z-index: 98;
  }
`
const StakeButton = styled.div`
  max-width: 258px;
  flex: 1;
  background: #ffab36;
  border-radius: 17px;
  height: 29px;
  line-height: 29px;
  text-align: center;
`
interface StakeInfoInterface {
  isStake: boolean
  type: string
  isTransverse?: boolean
  item: any
  deposit: () => void
  withdraw: () => void
}
export default function StakeInfo({
  isStake,
  type,
  isTransverse = false,
  item,
  deposit,
  withdraw,
}: StakeInfoInterface) {
  const isPc = useIsPcByScreenWidth()
  const currency0 = { address: item.token0 || undefined, isToken: item.token0 }
  const currency1 = { address: item.token1 || undefined, isToken: item.token1 }
  // TODO 现在模态框数量是以item为单位的，有多少个item就有多少个模态框，如果要优化，则把模态框在父组件中创建，共享模态框
  return (
    <Box>
      {isStake ? (
        <StakedBox>
          <LpImgs isShowWidth={type === collapseTypes.polymerizationFluidity ? true : false}>
            {type === collapseTypes.singleCoin ? (
              <SingleLogo isShowMargin={true} currency={currency0}></SingleLogo>
            ) : type === collapseTypes.liquidityMining ? (
              <DoubleCurrencyLogo currency0={currency0} currency1={currency1} size={22} />
            ) : (
              <PolWarpper>
                <PolBox className={'pol-box-style'}>
                  <div>
                    <SingleLogo isShowMargin={true} currency={currency0}></SingleLogo>
                    <StakeItem>
                      <StakedTitle>已存：</StakedTitle>
                      <StakedValue>
                        1.23K c{item.lp_name}
                        <span> ≈$222.56K </span>
                      </StakedValue>
                    </StakeItem>
                  </div>
                  <ButtonComponent clickBtn={deposit} btnName={'存款'}></ButtonComponent>
                </PolBox>
                <PolBox>
                  <div>
                    <SingleLogo isShowMargin={true} currency={currency1}></SingleLogo>
                    <StakeItem>
                      <StakedTitle>已存：</StakedTitle>
                      <StakedValue>
                        1.23K c{item.lp_name}
                        <span> ≈$222.56K </span>
                      </StakedValue>
                    </StakeItem>
                  </div>
                  <ButtonComponent clickBtn={withdraw} btnName={'取款'} backgroundColor={'#0E192C'}></ButtonComponent>
                </PolBox>
              </PolWarpper>
            )}
            {type !== collapseTypes.polymerizationFluidity && (
              <>
                <StakedContent isTransverse={isTransverse}>
                  <StakedTitle>已存：</StakedTitle>
                  <StakedValue>1.23K c{item.lp_name}</StakedValue>
                  <StakedTip>≈1.56K ETH-BUSD（$23.45K）</StakedTip>
                </StakedContent>
              </>
            )}
          </LpImgs>
          {type !== collapseTypes.polymerizationFluidity && (
            <StakedBtn>
              <ButtonComponent clickBtn={deposit} btnName={'存款'}></ButtonComponent>
              <ButtonComponent clickBtn={withdraw} btnName={'取款'} backgroundColor={'#0E192C'}></ButtonComponent>
            </StakedBtn>
          )}
        </StakedBox>
      ) : (
        <UnStakedBox>
          <LpImgs>
            {type === collapseTypes.singleCoin ? (
              <SingleLogo currency={{ address: '111' }}></SingleLogo>
            ) : (
              <DoubleCurrencyLogo currency0={'currency0'} currency1={'currency1'} size={22} />
            )}
          </LpImgs>
          {isPc ? (
            <StakeButton onClick={deposit}>存款</StakeButton>
          ) : (
            <ButtonComponent clickBtn={deposit} btnName={'存款'}></ButtonComponent>
          )}
        </UnStakedBox>
      )}
    </Box>
  )
}
