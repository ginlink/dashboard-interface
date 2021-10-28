import React, { useCallback } from 'react'
import styled from 'styled-components/macro'
import { ExternalLink } from '@/theme'
import jian from '../../assets/images/publicImg/jian.svg'
import converter_logo from '../../assets/images/publicImg/converter_logo.svg'
import { px2vwm } from '@/utils/adapteH5'
import ButtonComponent from '../ButtonComponents'
import StakeInfo from '../CollapseComponent/StakeInfo'
import { collapseTypes } from '@/constants/collapseType'
import RewardInfo from '../CollapseComponent/RewardInfo'
const Warpper = styled.div``
const LinkBox = styled.div`
  text-align: right;
  margin-top: ${px2vwm('12px')};
`
const MyExternalLink = styled(ExternalLink)`
  font-size: ${px2vwm('11px')};
  color: ${(props) => props.theme.text8} !important;
  text-decoration: none;
  &:hover {
    text-decoration: none;
  }
`
const StakeBox = styled.div`
  width: 100%;
  background: ${(props) => props.theme.bg13};
  border-radius: ${px2vwm('10px')};
  padding: ${px2vwm('17px')};
`
const Line = styled.div`
  width: 100%;
  height: 1px;
  background: ${(props) => props.theme.white};
  opacity: 0.1;
  margin: ${px2vwm('15px')} 0;
`
export default function PositionContentCardH5({
  type,
  item,
  isStake = false,
  deposit,
  withdraw,
}: {
  type: string
  item: any
  isStake?: boolean
  deposit: () => void
  withdraw: () => void
}) {
  const clickBtn = useCallback(() => {
    console.log('领取奖励', item)
  }, [item])
  const depositFn = useCallback(() => {
    deposit()
  }, [deposit])
  const withdrawFn = useCallback(() => {
    withdraw()
  }, [withdraw])
  return (
    <Warpper>
      <StakeBox>
        {/* <RewardBox>
          <Info>
            <img src={converter_logo} alt="" />
            <ContentBox>
              <Title>{'奖励：'}</Title>
              <Value>{'1.23K'} CON</Value>
            </ContentBox>
          </Info>
          <ButtonComponent clickBtn={clickBtn} btnName={'领取'}></ButtonComponent>
        </RewardBox> */}
        <RewardInfo rewardAddr={item.reward_pool}></RewardInfo>
        <Line></Line>
        <StakeInfo
          withdraw={withdrawFn}
          deposit={depositFn}
          item={item}
          isTransverse={true}
          type={type}
          isStake={isStake}
        ></StakeInfo>
      </StakeBox>
      {type === collapseTypes.liquidityMining && (
        <LinkBox>
          <MyExternalLink href={'http://www.baidu.com'}>
            获取 {item.lp_name} LP <img src={jian} alt="" />
          </MyExternalLink>
        </LinkBox>
      )}
    </Warpper>
  )
}
