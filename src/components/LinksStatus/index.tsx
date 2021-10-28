/*
 * @Author: your name
 * @Date: 2021-09-01 18:12:21
 * @LastEditTime: 2021-09-17 16:32:34
 * @LastEditors: jiangjin
 * @Description: In User Settings Edit
 * @FilePath: /converter-bsc-web/src/components/LinksStatus/index.tsx
 */
import React, { memo } from 'react'
import styled from 'styled-components/macro'
import { CaretDownOutlined } from '@ant-design/icons'
import { lighten } from 'polished'
import { MEDIUM } from '@/utils/adapteH5'
import { t } from '@/pages/adapteH5'

const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  border: 1px solid ${(props) => props.theme.primary1};
  border-radius: 16px;
  padding: 5px 15px;

  @media (max-width: ${MEDIUM}) {
    padding: 3px 10px;
    border-radius: 13px;
  }

  cursor: pointer;

  &:hover {
    .links-menu {
      display: block;
    }
  }
`

const Text = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: ${(props) => props.theme.primary1};
  line-height: 17px;

  margin-right: 10px;

  @media (max-width: ${MEDIUM}) {
    margin-right: 7px;
  }
`
const LinksMenuWrapper = styled.div`
  display: none;
  /* display: block; */
  position: absolute;
  top: 20px;
  left: -15px;
`
const LinksMenu = styled.div`
  margin-top: 20px;

  width: 110px;
  padding: 7px 0;
  text-align: center;

  background-color: ${(props) => lighten(0.03, props.theme.black)};
  border-radius: 20px;

  &:hover {
    display: block;
  }
`
const MenuText = styled.div`
  font-size: 11px;
  font-weight: 500;
  color: ${(props) => props.theme.white};
  line-height: 15px;

  padding: 10px 0;

  cursor: pointer;

  &:hover {
    color: ${(props) => props.theme.primary1};
  }
`
function LinksStatus() {
  return (
    <Wrapper>
      <Text>BSC</Text>
      <CaretDownOutlined style={{ color: '#FFAB36' }} />

      <LinksMenuWrapper className="links-menu">
        <LinksMenu>
          <MenuText>HECO</MenuText>
          <MenuText>BSC</MenuText>
        </LinksMenu>
      </LinksMenuWrapper>
    </Wrapper>
  )
}

export default memo(LinksStatus)
