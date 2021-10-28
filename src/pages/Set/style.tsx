/*
 * @Author: jiangjin
 * @Date: 2021-09-08 15:44:29
 * @LastEditTime: 2021-09-08 16:27:42
 * @LastEditors: jiangjin
 * @Description:
 *
 */
import { MEDIUM } from '@/utils/adapteH5'
import styled from 'styled-components/macro'
import { t } from '../adapteH5'

export const HeaderBox = styled.div`
  padding-top: 68px;
  background: linear-gradient(180deg, #021e4b 0%, #0c1626 100%);
  @media (max-width: ${MEDIUM}) {
    padding: 40px 15px 0 15px;
    margin: -6px -15px;
  }
`

export const SetWarpper = styled.div`
  width: 825px;
  margin: 0 auto;
  & > .lineStyle {
    height: 1px;
    background: #212d3e;
    width: 100%;
    margin: 20px 0;
  }
  @media (max-width: ${MEDIUM}) {
    width: unset;
    .ant-collapse-icon-position-right > .ant-collapse-item > .ant-collapse-header {
      padding-right: 16px;
    }
  }
`
export const CollapaseBox = styled.div`
  width: 100%;
  @media (max-width: ${MEDIUM}) {
    .ant-collapse-icon-position-right > .ant-collapse-item > .ant-collapse-header .ant-collapse-arrow {
      position: absolute;
      top: 32px;
    }
  }
`
