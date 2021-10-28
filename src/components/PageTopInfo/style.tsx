/*
 * @Author: jiangjin
 * @Date: 2021-09-02 22:44:00
 * @LastEditTime: 2021-09-06 17:02:48
 * @LastEditors: jiangjin
 * @Description:
 *
 */
import { MEDIUM, px2vwm } from '@/utils/adapteH5'
import styled from 'styled-components/macro'
export const ContentBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 825px;
  margin: 0 auto;
  margin-bottom: 56px;
  @media (max-width: ${MEDIUM}) {
    margin-bottom: ${px2vwm('40px')};
  }
`
export const InfoBox = styled.div<{ imgHeight: number; isShowTitleInfo: boolean }>`
  height: ${({ imgHeight }) => imgHeight + 'px'};
  display: flex;
  flex-direction: column;
  justify-content: ${({ isShowTitleInfo }) => (isShowTitleInfo ? 'space-between' : 'center')};
`
export const ImgBox = styled.div<{ imgWidth: number; imgHeight: number }>`
  & > img {
    width: ${({ imgWidth }) => imgWidth + 'px'};
    height: ${({ imgHeight }) => imgHeight + 'px'};
    margin-right: 45px;
  }
  @media (max-width: ${MEDIUM}) {
    & > img {
      width: ${({ imgWidth }) => px2vwm(imgWidth + 'px')};
      height: ${({ imgHeight }) => px2vwm(imgHeight + 'px')};
      margin-right: 0px;
    }
  }
`
export const TitleInfo = styled.div`
  margin-top: 15px;
  @media (max-width: ${MEDIUM}) {
    margin-top: ${px2vwm('3px')};
  }
`
export const Title = styled.div`
  font-size: 26px;

  color: ${(props) => props.theme.white};
  @media (max-width: ${MEDIUM}) {
    font-size: ${px2vwm('17px')};
  }
`
export const Content = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: #c6ccd2;
  margin-top: 11px;
  @media (max-width: ${MEDIUM}) {
    font-size: ${px2vwm('10px')};
    margin-top: ${px2vwm('7px')};
  }
`
export interface PageTopInfoParame {
  cardTitle: string
  cardValue: any
  title?: string
  content?: string
  imgUrl: string
  imgWidth: number
  imgHeight: number
  isShowTitleInfo?: boolean
}
