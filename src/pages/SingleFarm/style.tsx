import { MEDIUM } from '@/utils/adapteH5'
import styled from 'styled-components/macro'
import { t } from '../adapteH5'
export const SingleFarmWarpper = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 825px;
  margin: 0 auto;
  align-items: center;
  @media (max-width: ${MEDIUM}) {
    width: unset;
    .ant-collapse-icon-position-right > .ant-collapse-item > .ant-collapse-header {
      padding-right: 16px;
    }
  }
`
export const CollapaseBox = styled.div`
  margin-top: 24px;
  width: 100%;
  @media (max-width: ${MEDIUM}) {
    .ant-collapse-icon-position-right > .ant-collapse-item > .ant-collapse-header .ant-collapse-arrow {
      position: absolute;
      top: 24px;
    }
  }
`
export const HeaderBox = styled.div`
  padding-top: 83px;
  background: linear-gradient(180deg, #021e4b 0%, #0c1626 100%);
  @media (max-width: ${MEDIUM}) {
    padding: 42px 15px 0 15px;
    margin: -6px -15px;
  }
`
