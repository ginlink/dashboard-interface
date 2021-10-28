import useScrollPosition from '@react-hook/window-scroll'
import { darken } from 'polished'
import React from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components/macro'
import Logo from '../../assets/images/logo.svg'
import { useActiveWeb3React } from '../../hooks/web3'
import Menu from '../Menu'
import { RowFixed } from '../Row'
import Web3Status from '../Web3Status'
import MobileFixedNav from './NavtabH5'
import { MEDIUM, px2vwm } from 'utils/adapteH5'
import LinksStatus from '../LinksStatus'

const HeaderFrame = styled.div<{ showBackground: boolean }>`
  display: grid;
  grid-template-columns: 120px 1fr 120px;
  align-items: center;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  width: 100%;
  top: 0;
  left: 0;
  padding: 16px;
  z-index: 21;
  height: 76px;
  position: fixed;
  /* Background slide effect on scroll. */
  background-image: ${({ theme }) => `linear-gradient(to bottom, transparent 50%, ${theme.bg0} 50% )}}`};
  background-position: ${({ showBackground }) => (showBackground ? '0 -100%' : '0 0')};
  background-size: 100% 200%;
  box-shadow: 0px 0px 0px 1px ${({ theme, showBackground }) => (showBackground ? theme.bg2 : 'transparent;')};
  transition: background-position 0.1s, box-shadow 0.1s;

  @media (max-width: ${MEDIUM}) {
    height: ${px2vwm`76px`};
    padding: 1rem;
    grid-template-columns: auto auto;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 1rem;
  `}
`

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-self: flex-end;

  gap: 3px;

  @media (max-width: ${MEDIUM}) {
    flex-direction: row;
    justify-content: space-between;
    justify-self: center;
    max-width: ${px2vwm`960px`};
    height: ${px2vwm`30px`};

    border-radius: ${px2vwm`12px`} ${px2vwm`12px`} 0 0;
  }
`

const HeaderElement = styled.div`
  display: flex;
  align-items: center;

  /* addresses safari's lack of support for "gap" */
  & > *:not(:first-child) {
    margin-left: 8px;
  }

  @media (max-width: ${MEDIUM}) {
    flex-direction: row-reverse;
    align-items: center;
  }
`

const HeaderElementWrap = styled.div`
  display: flex;
  align-items: center;
`

const HeaderRow = styled(RowFixed)`
  @media (max-width: ${MEDIUM}) {
    width: 100%;
  }
`

const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme, active }) => (!active ? theme.bg1 : theme.bg2)};
  border-radius: 12px;
  white-space: nowrap;
  width: 100%;
  cursor: pointer;

  :focus {
    border: 1px solid blue;
  }
`

const Title = styled.a`
  display: flex;
  align-items: center;
  pointer-events: auto;
  justify-self: flex-start;
  margin-right: 12px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    justify-self: center;
  `};
  :hover {
    cursor: pointer;
  }
  & > img {
    height: 22px;
  }

  @media (max-width: ${MEDIUM}) {
    & > img {
      height: 22px;
    }
  }
`

const activeClassName = 'ACTIVE'

export const StyledNavLink = styled(NavLink).attrs({
  activeClassName,
})`
  align-items: left;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: #565a69;
  font-size: 1rem;
  width: fit-content;
  font-weight: 500;
  padding: 8px 12px;
  word-break: break-word;
  margin-top: 6px;
  &::after {
    content: '';
    display: block;
    height: 3px;
    background: transparent;
    border-radius: 3px;
    margin-top: 6px;
  }

  &.${activeClassName} {
    border-radius: 12px;
    font-weight: 600;
    color: #7a3cef;
    &::after {
      background: #7a3cef;
    }
  }

  :hover,
  :focus {
    color: ${({ theme }) => darken(0.1, theme.text1)};
  }
`

export const StyledMenuButton = styled.button`
  position: relative;
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  height: 35px;
  background-color: ${({ theme }) => theme.bg2};
  margin-left: 8px;
  padding: 0.15rem 0.5rem;
  border-radius: 0.5rem;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    /* background-color: ${({ theme }) => theme.bg4}; */
  }

  svg {
    margin-top: 2px;
  }
  > * {
    stroke: ${({ theme }) => theme.text1};
  }

  @media (max-width: ${MEDIUM}) {
    height: ${px2vwm`30px`};
    width: ${px2vwm`30px`};
    font-size: ${px2vwm`12px`};
    padding: 0;
    border-radius: ${px2vwm`7px`};
  }
`
export default function Header() {
  const { account } = useActiveWeb3React()

  const scrollY = useScrollPosition()

  return (
    <HeaderFrame showBackground={scrollY > 45}>
      <HeaderRow>
        <Title href=".">
          <img src={Logo} alt="logo" />
        </Title>
      </HeaderRow>

      <MobileFixedNav />

      <HeaderControls>
        <HeaderElement>
          <Web3Status />
        </HeaderElement>
        <HeaderElement>
          <LinksStatus />
        </HeaderElement>
        <HeaderElementWrap>
          <Menu />
        </HeaderElementWrap>
      </HeaderControls>
    </HeaderFrame>
  )
}
