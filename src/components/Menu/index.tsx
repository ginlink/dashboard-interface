import React, { useRef, useMemo } from 'react'
// import { BookOpen, Code, Info, MessageCircle, PieChart } from 'react-feather'
import wen from '../../assets/images/menu/shu.svg'
import telegram from '../../assets/images/menu/telegram.svg'
import twitter from '../../assets/images/menu/twitter.svg'
import shu from '../../assets/images/menu/wen.svg'
import doc from '../../assets/images/menu/doc.svg'
import lian from '../../assets/images/menu/lian.svg'
import { Link } from 'react-router-dom'
import styled, { css } from 'styled-components/macro'
import { ReactComponent as MenuIcon } from '../../assets/images/menu/menu.svg'
import { ReactComponent as MoreIcon } from '../../assets/images/menu/more.svg'
// import { useOnClickOutside } from '../../hooks/useOnClickOutside'
import { Divide, ExternalLink } from '../../theme'
import { MEDIUM, px2vwm } from 'utils/adapteH5'
import LangCrad from 'components/LangCrad'
import { SpInfo, Twitter, Audit, Doc, Telegram, ContactUs } from 'constants/outlinks'
import { ReactComponent as SheepIcon } from 'assets/images/sider/logo-icon.svg'
import { computeNumUnit } from 'utils/formatNum'
// import { useHomeData } from 'state/http/hooks'
import { useIsPcByScreenWidth } from '@/hooks/useIsPc'
import { useOnClickOutside } from '@/hooks/useOnClickOutside'
import { darken, lighten } from 'polished'
import { useModalOpen, useToggleModal } from '@/store/application/hooks'
import { ApplicationModal } from '@/store/application/reducer'

export enum FlyoutAlignment {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

const StyledMenuIcon = styled(MoreIcon)`
  width: 22px;
  height: 22px;
  path {
    stroke: ${({ theme }) => theme.white};
  }
`

const StyledMenuButton = styled.button`
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  margin: 0;
  padding: 0;
  height: 35px;

  padding: 0.15rem 0.5rem;
  border-radius: 0.5rem;

  :hover,
  :focus {
    cursor: pointer;
    outline: none;
    background-color: ${({ theme }) => theme.bg3};
  }

  svg {
    margin-top: 2px;
  }

  @media (max-width: ${MEDIUM}) {
    width: ${px2vwm`30px`};
    height: ${px2vwm`30px`};
    padding: 0;
    border-radius: ${px2vwm`7px`};
  }
`

const StyledMenu = styled.div`
  /* margin-left: 0.5rem; */
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border: none;
  text-align: left;
`
const DivideLine = styled.div`
  margin: 7px 0;
  height: 1px;
  background-color: ${(props) => lighten(0.1, props.theme.black)};
  transform: scaleY(50%);
`
const SheepPrice = styled.div`
  padding: 8px;
  display: flex;
  padding-bottom: 0px;
`
const CurrentPrice = styled.div`
  margin-left: 8px;
  font-size: ${px2vwm`15px`};

  color: ${(props) => props.theme.white};
`
const MySheepIcon = styled(SheepIcon)`
  width: ${px2vwm`16px`};
  height: ${px2vwm`16px`};
`
const MenuFlyout = styled.span<{ flyoutAlignment?: FlyoutAlignment }>`
  min-width: 8.125rem;
  background-color: ${(props) => props.theme.black};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 12px;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  font-size: 1rem;
  position: absolute;
  top: 3rem;
  z-index: 100;
  ${({ flyoutAlignment = FlyoutAlignment.RIGHT }) =>
    flyoutAlignment === FlyoutAlignment.RIGHT
      ? css`
          right: 0rem;
        `
      : css`
          left: 0rem;
        `};
  @media (max-width: ${MEDIUM}) {
    top: ${px2vwm`53px`};
  }
`

const MenuItem = styled(ExternalLink)<{ isPc?: boolean }>`
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: ${({ isPc }) => (isPc ? 'space-between' : 'flex-start')};
  padding: 8px;
  color: ${({ theme }) => theme.white};
  > img {
    margin-right: ${({ isPc }) => (isPc ? '0' : '8px')};
  }
  :hover {
    color: ${({ theme }) => darken(0.05, theme.white)};
    cursor: pointer;
    text-decoration: none;
  }
  width: 178px;
  @media (max-width: ${MEDIUM}) {
    font-size: ${px2vwm`16px`};
    width: unset;
  }
`
const InternalMenuItem = styled(Link)`
  flex: 1;
  padding: 0.5rem 0.5rem;
  color: ${({ theme }) => theme.text2};
  :hover {
    color: ${({ theme }) => theme.text1};
    cursor: pointer;
    text-decoration: none;
  }
  > svg {
    margin-right: 8px;
  }
`
const ChangeLanguagesAndSkin = styled.div`
  color: ${({ theme }) => theme.text3};
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: ${px2vwm`16px`};
  font-weight: 500;
  padding-bottom: 0;
  img {
    width: ${px2vwm`16px`};
    height: ${px2vwm`16px`};
  }
`

export default function Menu() {
  const node = useRef<HTMLDivElement>()
  const open = useModalOpen(ApplicationModal.MENU)
  const toggle = useToggleModal(ApplicationModal.MENU)
  useOnClickOutside(node, open ? toggle : undefined)
  // const homeData = useHomeData()
  // const spcPrice = useMemo(() => homeData?.[0]?.spc_price, [homeData])
  const spcPrice = '1.00'

  const isPc = useIsPcByScreenWidth()
  return (
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/30451
    <StyledMenu ref={node as any}>
      <StyledMenuButton onClick={toggle}>
        <StyledMenuIcon />
      </StyledMenuButton>

      {open && (
        <>
          {isPc ? (
            <MenuFlyout>
              <MenuItem isPc={true} href={Audit}>
                <div>Audit</div>
                <img src={doc} />
              </MenuItem>
              <MenuItem isPc={true} href={Doc}>
                <div>Doc</div>
                <img src={shu} />
              </MenuItem>
              <MenuItem isPc={true} href={SpInfo}>
                <div>Chart</div>
                <img src={wen} />
              </MenuItem>
              <MenuItem isPc={true} href={Twitter}>
                <div>Twitter</div>
                <img src={twitter} />
              </MenuItem>
              <MenuItem isPc={true} href={Telegram}>
                <div>Telegram</div>
                <img src={telegram} />
              </MenuItem>
              <MenuItem isPc={true} href={ContactUs}>
                Contact us
                <img src={lian} />
              </MenuItem>
            </MenuFlyout>
          ) : (
            <MenuFlyout>
              <MenuItem isPc={false} href={Audit}>
                <img src={doc} />
                <div style={{ fontSize: '0.8rem' }}>Audit</div>
              </MenuItem>
              <MenuItem isPc={false} href={Doc}>
                <img src={shu} />
                <div style={{ fontSize: '0.8rem' }}>Doc</div>
              </MenuItem>
              <MenuItem isPc={false} href={SpInfo}>
                <img src={wen} />
                <div style={{ fontSize: '0.8rem' }}>Chart</div>
              </MenuItem>
              <MenuItem isPc={false} href={Twitter}>
                <img src={twitter} />
                <div style={{ fontSize: '0.8rem' }}>Twitter</div>
              </MenuItem>
              <MenuItem isPc={false} href={Telegram}>
                <img src={telegram} />
                <div style={{ fontSize: '0.8rem' }}>Telegram</div>
              </MenuItem>
              <MenuItem isPc={false} href={ContactUs}>
                <img src={lian} />
                <div style={{ fontSize: '0.8rem' }}>Contact us</div>
              </MenuItem>
              <DivideLine />
              <SheepPrice>
                <MySheepIcon />
                <CurrentPrice>${computeNumUnit(spcPrice)}</CurrentPrice>
              </SheepPrice>
              <ChangeLanguagesAndSkin>
                <LangCrad ispc={false} bottom="-100px" left="-128px" onDismiss={() => toggle()} />
              </ChangeLanguagesAndSkin>
            </MenuFlyout>
          )}
        </>
      )}
    </StyledMenu>
  )
}
