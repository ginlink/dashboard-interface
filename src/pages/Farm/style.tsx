import { MEDIUM } from '@/utils/adapteH5'
import styled from 'styled-components/macro'

export const FarmWarpper = styled.div`
  max-width: 825px;
  margin: 0 auto;
  margin-bottom: 64px;
  & > .lineStyle {
    height: 1px;
    background: #212d3e;
    width: 100%;
    margin: 20px 0;
  }
  @media (max-width: ${MEDIUM}) {
    width: unset;
    margin-bottom: 0px;
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
export const HeaderBox = styled.div`
  padding-top: 67px;
  background: linear-gradient(180deg, #021e4b 0%, #0c1626 100%);
  @media (max-width: ${MEDIUM}) {
    padding: 29px 15px 0 15px;
    margin: -6px -15px;
  }
`
