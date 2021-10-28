import styled from 'styled-components/macro'
import { NavLink } from 'react-router-dom'
import { MEDIUM, px2vwm } from '@/utils/adapteH5'
export const HomePositionCardWarpper = styled.div`
  /* margin-bottom: 143px; */
  @media (max-width: ${MEDIUM}) {
    /* margin-bottom: 45px; */
  }
  .card-container > .ant-tabs-card .ant-tabs-content {
    height: 120px;
    margin-top: -16px;
  }
  .card-container > .ant-tabs-card .ant-tabs-content > .ant-tabs-tabpane {
    padding: 16px;
    background: ${(props) => props.theme.bg12};
  }
  .ant-tabs-card.ant-tabs-top > .ant-tabs-nav .ant-tabs-tab-active,
  .ant-tabs-card.ant-tabs-top > div > .ant-tabs-nav .ant-tabs-tab-active {
    border-radius: 11px 11px 0 0;
  }
  .card-container > .ant-tabs-card .ant-tabs-content > .ant-tabs-tabpane {
    border-radius: 0 11px 11px 11px;
  }
  .card-container > .ant-tabs-card > .ant-tabs-nav::before {
    display: none;
  }
  .card-container > .ant-tabs-card .ant-tabs-tab,
  [data-theme='compact'] .card-container > .ant-tabs-card .ant-tabs-tab {
    background: transparent;
    border-color: transparent;
    border: 0;
  }
  .card-container > .ant-tabs-card .ant-tabs-tab-active,
  [data-theme='compact'] .card-container > .ant-tabs-card .ant-tabs-tab-active {
    background: ${(props) => props.theme.bg12};
    border: 0;
    border-radius: 10px 10px 0 0;
    .ant-tabs-tab-btn {
      color: white;
      outline: none;
    }
  }
  .ant-tabs-tab-btn {
    color: white;
    @media (max-width: ${MEDIUM}) {
      font-size: 10px;
    }
  }
  #components-tabs-demo-card-top .code-box-demo {
    padding: 24px;
    overflow: hidden;
    background: #f5f5f5;
  }
  [data-theme='compact'] .card-container > .ant-tabs-card .ant-tabs-content {
    height: 120px;
    margin-top: -8px;
  }
  .card-container > .ant-tabs-card .ant-tabs-content {
    height: unset;
  }
  [data-theme='dark'] .card-container > .ant-tabs-card .ant-tabs-tab {
    background: transparent;
    border-color: transparent;
  }
  [data-theme='dark'] #components-tabs-demo-card-top .code-box-demo {
    background: #000;
  }
  [data-theme='dark'] .card-container > .ant-tabs-card .ant-tabs-content > .ant-tabs-tabpane {
    background: #141414;
    border-radius: 0 10px 10px 10px;
  }
  [data-theme='dark'] .card-container > .ant-tabs-card .ant-tabs-tab-active {
    background: #141414;
    border-color: #141414;
  }
  .ant-tabs-tab-btn:focus,
  .ant-tabs-tab-remove:focus,
  .ant-tabs-tab-btn:active,
  .ant-tabs-tab-remove:active {
    color: ${(props) => props.theme.white};
  }
`

export const MyNavLink = styled(NavLink)`
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  justify-content: flex-end;
  color: ${(props) => props.theme.text8} !important;
  @media (max-width: ${MEDIUM}) {
    font-size: 10px;
    align-items: center;
    img {
      width: 7px;
      height: 7px;
    }
  }
`
export const PositionCardBox = styled.div`
  display: flex;
  /* flex-wrap: wrap; */

  /* overflow-x: scroll; */
`

export const ScrollableRow = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  white-space: nowrap;

  @media (max-width: ${MEDIUM}) {
    justify-content: space-between;
  }
`
