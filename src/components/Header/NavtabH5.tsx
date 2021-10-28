import React, { memo, useCallback } from 'react'
import Row from 'components/Row'
import { NavLink, useLocation } from 'react-router-dom'
import styled from 'styled-components/macro'
import { darken } from 'polished'
import homeImg from '../../assets/images/navtab/home.svg'
import setImg from '../../assets/images/navtab/set.svg'
import singleImg from '../../assets/images/navtab/single.svg'
import farmImg from '../../assets/images/navtab/farm.svg'
import profileImg from '../../assets/images/navtab/profile.svg'

import homeImgActive from '../../assets/images/navtab/home-active.svg'
import setImgActive from '../../assets/images/navtab/set-active.svg'
import singleImgActive from '../../assets/images/navtab/single-active.svg'
import farmImgActive from '../../assets/images/navtab/farm-active.svg'
import profileImgActive from '../../assets/images/navtab/profile-active.svg'
import { px2vwm } from 'utils/adapteH5'

const IconBase = styled.div<{ active: boolean; icon: string; activeIcon: string }>`
  background-image: url(${({ active, icon, activeIcon }) => (active ? activeIcon : icon)});
  background-repeat: no-repeat;
  background-size: cover;
  width: 20px;
  height: 20px;

  /* transition: background 0.3s; */
  /* 不能开启transition，否则在手机端切换图标会闪动 */
`

const NavIcon = styled(IconBase)`
  width: 22px;
  height: 22px;

  margin-bottom: 6px;
`

const activeClassName = 'ACTIVE'

const PageWrapper = styled.div`
  height: ${px2vwm`67px`};
  justify-self: flex-end;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  justify-self: flex-end;
  position: fixed;
  bottom: 0;
  left: 0;
  background-color: ${({ theme }) => theme.black};
  @media only screen and (min-device-height: 812px) {
    /* height: calc(${px2vwm`83px`} + constant(safe-area-inset-bottom)); */
    height: calc(${px2vwm`83px`} + env(safe-area-inset-bottom));
  }
`
const HeaderLinks = styled(Row)`
  justify-self: flex-start;
  width: 100%;
  padding: ${px2vwm`8px`};
  border-radius: ${px2vwm`16px`};
  display: grid;
  grid-auto-flow: column;
  grid-gap: ${px2vwm`3px`};
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
`
const StyledNavLink = styled(NavLink).attrs({
  activeClassName,
})`
  .iconStyle {
    margin-bottom: 3px;
  }
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  font-weight: 500;
  word-break: break-word;
  margin-top: ${px2vwm`6px`};
  width: 100%;

  text-align: center;
  font-size: ${px2vwm`10px`};
  font-weight: 500;
  color: ${({ theme }) => theme.text2};
  line-height: ${px2vwm`14px`};

  :hover {
    color: ${({ theme }) => darken(0.1, theme.white)};
  }

  &.${activeClassName} {
    border-radius: ${px2vwm`12px`};
    font-weight: 600;
    color: ${({ theme }) => theme.primary1};
  }

  & > img {
    width: ${px2vwm`22px`};
    height: ${px2vwm`22px`};
    display: block;
    margin: 0 auto;
    margin-bottom: ${px2vwm`3px`};
  }
`

export default memo(function MobileFixedNav() {
  const location = useLocation()
  const _has = useCallback(
    (target: string) => {
      // console.log('[location.pathname]:', location.pathname)
      return location.pathname === '/' + target
    },
    [location.pathname]
  )

  return (
    <>
      <PageWrapper>
        <HeaderLinks>
          <StyledNavLink id={`swap-nav-link`} to={'/home'}>
            <NavIcon className={'iconStyle'} active={_has('home')} icon={homeImg} activeIcon={homeImgActive} />
            首页
          </StyledNavLink>
          <StyledNavLink id={`swap-nav-link`} to={'/set'}>
            <NavIcon className={'iconStyle'} active={_has('set')} icon={setImg} activeIcon={setImgActive} />
            聚合流动性
          </StyledNavLink>
          <StyledNavLink
            id={`pool-nav-link`}
            to={'/single-farm'}
            // 匹配其他路由也生效
            // isActive={(match, { pathname }) =>
            //   Boolean(match) ||
            //   pathname.startsWith('/add') ||
            //   pathname.startsWith('/remove') ||
            //   pathname.startsWith('/increase') ||
            //   pathname.startsWith('/find')
            // }
          >
            <NavIcon
              className={'iconStyle'}
              active={_has('single-farm')}
              icon={singleImg}
              activeIcon={singleImgActive}
            />
            单币挖矿
          </StyledNavLink>
          <StyledNavLink id={`swap-nav-link`} to={'/farm'}>
            <NavIcon className={'iconStyle'} active={_has('farm')} icon={farmImg} activeIcon={farmImgActive} />
            {/* Liquidity */}
            流动性挖矿
          </StyledNavLink>
          <StyledNavLink id={`swap-nav-link`} to={'/profile'}>
            <NavIcon className={'iconStyle'} active={_has('profile')} icon={profileImg} activeIcon={profileImgActive} />
            我的
          </StyledNavLink>
        </HeaderLinks>
      </PageWrapper>
    </>
  )
})
