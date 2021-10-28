import { MEDIUM, px2vwm } from '@/utils/adapteH5'
import styled from 'styled-components/macro'
import bg from '../../assets/images/publicImg/bg.svg'
export const ContentBox = styled.div<{ width?: number; height?: number }>`
  width: ${({ width }) => (width ? width + 'px' : '300px')};
  height: ${({ height }) => (height ? height + 'px' : '83px')};
  background: url(${bg}) 100%;
  border-radius: 12px;
  padding-top: 18px;
  padding-left: 23px;
  @media (max-width: ${MEDIUM}) {
    width: ${px2vwm('165px')};
    height: ${px2vwm('55px')};
    padding-top: ${px2vwm('11px')};
    padding-left: ${px2vwm('15px')};
  }
`
export const Title = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: #bdc8da;
  @media (max-width: ${MEDIUM}) {
    font-size: ${px2vwm('11px')};
  }
`
export const Value = styled.div<{ color?: string }>`
  color: ${({ color }) => (color ? color : '#FFAB36')};
  font-size: 21px;
  font-weight: bold;
  margin-top: 9px;
  @media (max-width: ${MEDIUM}) {
    margin-top: ${px2vwm('5px')};
    font-size: ${px2vwm('14px')};
  }
`
