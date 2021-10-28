import ButtonComponent from '@/components/ButtonComponents'
import PositionCard from '@/components/PositionCard'
import { collapseTypes } from '@/constants/collapseType'
import React, { memo, useCallback } from 'react'
import myIcon1 from '../../assets/images/profile/myIcon1.svg'
import myIcon2 from '../../assets/images/profile/myIcon2.png'
import myIcon3 from '../../assets/images/profile/myIcon3.png'
import {
  ProfileWarpper,
  HeaderBox,
  ProfileBanlanceInfo,
  ProfileRewardInfo,
  PersonTvl,
  PersonBanlance,
  PersonPositions,
  TvlContent,
  Title,
  TvlValue,
  BalanceContent,
  PriceValue,
  RewardInfo,
  Tip,
  HeaderBg,
} from './style'

function Profile() {
  const receiveBtn = useCallback(() => {
    console.log('点击领取')
  }, [])
  const polymerizationFluidityList = [{ apy: '36.88', staked: '345.23K', reward: '4.12K', lp_name: 'ETH-BUSD' }] as any
  const liquidMiningList = [{ apy: '36.88', staked: '345.23K', reward: '4.12K', lp_name: 'ETH-BUSD' }] as any
  // const singleList = [{ apy: '36.88', staked: '345.23K', reward: '4.12K', lp_name: 'BNB' }] as any
  const singleList = [] as any
  const deposit = useCallback(() => {
    console.log('存款')
  }, [])
  const receive = useCallback(() => {
    console.log('领取奖励')
  }, [])
  const withdraw = useCallback(() => {
    console.log('取款')
  }, [])
  return (
    <>
      <HeaderBg></HeaderBg>
      <ProfileWarpper>
        <HeaderBox>
          <ProfileBanlanceInfo>
            <PersonTvl>
              <img src={myIcon1} alt="" />
              <TvlContent>
                <Title>个人锁仓：</Title>
                <TvlValue>$563.96</TvlValue>
              </TvlContent>
            </PersonTvl>
            <PersonBanlance>
              <img src={myIcon2} alt="" />
              <BalanceContent>
                <Title>钱包余额：</Title>
                <PriceValue>
                  <span>14.33k</span>CON
                </PriceValue>
              </BalanceContent>
            </PersonBanlance>
          </ProfileBanlanceInfo>
          <ProfileRewardInfo>
            <img src={myIcon3} alt="" />
            <RewardInfo>
              <Title>待领取：</Title>
              <PriceValue>
                <span>14.33k </span>CON
              </PriceValue>
              <Tip>预计在钱包中确认1次</Tip>
            </RewardInfo>
            <ButtonComponent clickBtn={receiveBtn} btnName={'领取'}></ButtonComponent>
          </ProfileRewardInfo>
        </HeaderBox>
        <PersonPositions>
          <PositionCard
            tip={''}
            type={collapseTypes.polymerizationFluidity}
            title={'聚合流动性挖矿'}
            list={polymerizationFluidityList}
            receive={receive}
            deposit={deposit}
            withdraw={withdraw}
          ></PositionCard>
          <PositionCard
            tip={''}
            receive={receive}
            deposit={deposit}
            withdraw={withdraw}
            type={collapseTypes.singleCoin}
            title={'单币挖矿'}
            list={singleList}
          ></PositionCard>
          <PositionCard
            receive={receive}
            deposit={deposit}
            withdraw={withdraw}
            tip={'Pancake'}
            type={collapseTypes.liquidityMining}
            title={'流动性挖矿'}
            list={liquidMiningList}
          ></PositionCard>
        </PersonPositions>
      </ProfileWarpper>
    </>
  )
}

export default memo(Profile)
