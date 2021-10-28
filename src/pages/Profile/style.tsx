import { MEDIUM } from '@/utils/adapteH5'
import styled from 'styled-components/macro'
import bg1 from '../../assets/images/profile/bg.svg'
import bg2 from '../../assets/images/profile/bg2.svg'
export const ProfileWarpper = styled.div`
  position: relative;
  z-index: 1;
  width: 825px;
  margin: 0 auto;
  margin-top: -186px;
  margin-bottom: 53px;
  @media (max-width: ${MEDIUM}) {
    width: 100%;
    margin-bottom: unset;
  }
`
export const HeaderBox = styled.div`
  width: 100%;
  height: 82px;
  /* 此高度可以固定，让子元素高度一致 */

  display: flex;
  justify-content: space-between;
  align-items: center;

  font-size: 15px;
  font-weight: bold;
  color: ${(props) => props.theme.white};
  img {
    width: 38px;
    height: 38px;
  }

  @media (max-width: ${MEDIUM}) {
    flex-direction: column;
    height: unset;
  }
`
export const ProfileBanlanceInfo = styled.div`
  width: 503px;
  height: 100%;
  display: flex;
  align-items: center;
  background: url(${bg1}) 100% no-repeat;
  background-size: cover;
  justify-content: space-between;
  border-radius: 12px;
  padding: 22px 26px;
  @media (max-width: ${MEDIUM}) {
    width: 100%;
  }
`
export const ProfileRewardInfo = styled.div`
  width: 300px;
  height: 100%;
  background: url(${bg2}) 100% no-repeat;
  background-size: cover;
  border-radius: 12px;
  padding: 15px 26px;

  display: flex;
  justify-content: space-between;
  align-items: center;
  button {
    margin-top: 3px;
    color: ${(props) => props.theme.black};
  }

  @media (max-width: ${MEDIUM}) {
    width: 100%;
    margin-top: 15px;
  }
`
export const PersonTvl = styled.div`
  width: 50%;
  display: flex;
  align-items: center;
`
export const TvlContent = styled.div`
  margin-left: 15px;
`
export const PersonBanlance = styled.div`
  width: 50%;
  display: flex;
  align-items: center;
`
export const PersonPositions = styled.div`
  padding-top: 15px;
`
export const TvlValue = styled.div`
  margin-top: 4px;
`

export const Title = styled.div`
  font-size: 11px;
  line-height: 15px;
  color: ${(props) => props.theme.text8};
`
export const BalanceContent = styled.div`
  margin-left: 15px;
`
export const PriceValue = styled.div`
  font-size: 15px;
  font-weight: bold;
  line-height: 20px;
  color: ${(props) => props.theme.text9};
  margin-top: 5px;
`
export const RewardInfo = styled.div``
export const Tip = styled.div`
  font-size: 9px;
  font-weight: 400;
  line-height: 13px;
  color: ${(props) => props.theme.text8};
  margin-top: 5px;
`
export const HeaderBg = styled.div`
  width: 100%;
  height: 278px;
  background: linear-gradient(180deg, #021e4b 0%, #0c1626 100%);
  position: relative;
  top: 0;
  z-index: 0;
  @media (max-width: ${MEDIUM}) {
    /* width: 100vw; */
    width: 100%;
    height: 200px;
    margin: -6px -15px;
  }
`
