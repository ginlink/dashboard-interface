import styled from 'styled-components/macro'
import bg from '../../assets/images/home/bg1.png'
import bg2 from '../../assets/images/home/bg2.png'
import { MEDIUM } from 'utils/adapteH5'
import { t } from '../adapteH5'
export const HomeWarpper = styled.div`
  width: 100%;
`
export const Header = styled.div`
  background: url(${bg}) 100%;
  padding: 87px 0 0 0;
  @media (max-width: ${MEDIUM}) {
    padding: 36px 15px 0 15px;
    margin: -6px -15px;
  }
`

export const HeaderContent = styled.div`
  max-width: 825px;
  margin: 0 auto;
  button {
    cursor: pointer;
  }
`
export const ContentBox = styled.div`
  max-width: 825px;
  margin: 0 auto;
`
export const TitleAndImgBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media (max-width: ${MEDIUM}) {
    flex-direction: column;
  }
`
export const InfoBox = styled.div`
  margin-top: 71px;
  min-height: 65px;
  background: ${(props) => props.theme.black};
  box-shadow: 0px 2px 26px 0px ${(props) => props.theme.boxShadow2};
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 45px;
  @media (max-width: ${MEDIUM}) {
    margin-top: 20px;
    padding: 0 31.5px;
  }
`
export const TitleBox = styled.div`
  @media (max-width: ${MEDIUM}) {
    text-align: center;
  }
`
export const ItemBox = styled.div`
  display: flex;
  align-items: center;
  @media (max-width: ${MEDIUM}) {
    flex-direction: column;
  }
`
export const PriceValue = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: ${(props) => props.theme.text9};
  @media (max-width: ${MEDIUM}) {
    font-size: 17px;
    margin-top: 6px;
  }
`
export const InfoTitle = styled.div`
  font-size: 11px;
  font-weight: 500;
  color: ${(props) => props.theme.text8};
  margin-right: 9px;
  @media (max-width: ${MEDIUM}) {
    margin-right: 0px;
  }
`
export const ImgBox = styled.div`
  img {
    width: 365px;
    height: 329px;
  }
  @media (max-width: ${MEDIUM}) {
    margin-top: 19px;
    img {
      width: 290px;
      height: 259px;
    }
  }
`
export const Title = styled.div`
  font-size: 27px;
  font-weight: 700;
  color: ${(props) => props.theme.white};
  @media (max-width: ${MEDIUM}) {
    font-size: 18px;
    text-align: center;
  }
`
export const Line = styled.div<{ color: string }>`
  width: 30px;
  height: 2px;
  background: ${({ color }) => color};
  margin-bottom: 30px;
  @media (max-width: ${MEDIUM}) {
    width: 20px;
    height: 1px;
    margin: 0 auto;
    margin-bottom: 20px;
  }
`
export const Tip = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => props.theme.white};
  margin-top: 12px;
  @media (max-width: ${MEDIUM}) {
    margin-top: 8px;
    font-size: 10px;
  }
`
export const BtnBox = styled.div`
  display: flex;
  align-items: center;
  margin-top: 26px;
  button {
    width: 98px;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 0;
  }
  button:nth-child(2) {
    margin-left: 12px;
  }
  @media (max-width: ${MEDIUM}) {
    margin-top: 16px;
    justify-content: center;
  }
`
export const MiningPoolBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 89px;
  padding-top: 26px;
  margin-bottom: 104px;
  img {
    width: 365px;
    height: 231px;
  }
  @media (max-width: ${MEDIUM}) {
    padding-top: 45px;
    margin-bottom: 45px;
    margin-top: 0;
    flex-direction: column-reverse;
    img {
      margin-top: 15px;
      width: 345px;
      height: 156px;
    }
  }
`
export const MiningPoolTitleBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  @media (max-width: ${MEDIUM}) {
    align-items: center;
  }
`
export const PartnerBox = styled.div`
  background: url(${bg2}) 100%;
  padding: 10px 0 155px 0;
  @media (max-width: ${MEDIUM}) {
    padding: 0px 0 59px 0;
  }
`
export const PartnerTitle = styled.div`
  text-align: center;
  font-size: 15px;
  font-weight: 500;
  color: ${(props) => props.theme.white};
  margin-bottom: 23px;
  @media (max-width: ${MEDIUM}) {
    margin-bottom: 15px;
  }
`

export const PartnerImgs = styled.div`
  max-width: 825px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  div {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  img {
    height: 27px;
  }
  @media (max-width: ${MEDIUM}) {
    img {
      height: 18px;
    }
  }
`
export const AuditBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 140px;

  img {
    margin-bottom: 83px;
  }
  @media (max-width: ${MEDIUM}) {
    margin-top: 45px;
    img {
      width: 55px;
      height: 18px;
      margin-bottom: 30px;
    }
  }
`
export const AuditTip = styled.div`
  font-size: 15px;
  font-weight: 500;
  color: ${(props) => props.theme.white};
  margin: 45px 0 23px 0;
  @media (max-width: ${MEDIUM}) {
    margin: 20px 0 15px 0;
  }
`
