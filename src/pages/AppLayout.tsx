import { Layout as Layoutd, Menu as Menud } from 'antd'
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import styled, { css } from 'styled-components/macro'
import * as Icon from 'components/Icon'
import SubMenud from 'antd/lib/menu/SubMenu'
import LangCrad from '@/components/LangCrad'

import { computeNumUnit } from 'utils/formatNum'

import bgHe from '@/assets/images/home/bg-he.png'
import bgHeH5 from '@/assets/images/home/bg-he-h5.png'
import sheepIcon from '@/assets/images/sider/logo-icon.png'
import brandIconUrl from '@/assets/images/sider/logo-icon.png'
import { ReactComponent as CollapseIcon } from '@/assets/images/sider/collapse.svg'
import { ReactComponent as CollapsedIcon } from '@/assets/images/sider/collapsed.svg'

import { MEDIUM, px2vwm } from 'utils/adapteH5'
// import { Trans } from '@lingui/macro'
// import { routerList } from 'constants/routerList'
import { NavLink, useLocation } from 'react-router-dom'
import { SpInfo, Twitter, Audit, Doc, Telegram, ContactUs } from 'constants/normal-url'
import { LocalLoader } from 'components/Loader'

import home from '../assets/images/sider/home.svg'
import set from '../assets/images/sider/set.svg'
import single from '../assets/images/sider/single.svg'
import farm from '../assets/images/sider/farm.svg'
import profile from '../assets/images/sider/profile.svg'
import more from '../assets/images/sider/more.svg'

import homeActive from '../assets/images/sider/home-active.svg'
import setActive from '../assets/images/sider/set-active.svg'
import singleActive from '../assets/images/sider/single-active.svg'
import farmActive from '../assets/images/sider/farm-active.svg'
import profileActive from '../assets/images/sider/profile-active.svg'
import moreActive from '../assets/images/sider/more-active.svg'
import { darken, lighten } from 'polished'
import { useIsPcByScreenWidth } from '@/hooks/useIsPc'
import { t } from './adapteH5'
import { ReactComponent as SheepIcon } from 'assets/images/sider/logo-icon.svg'
import { useScreenWidth } from '@/store/application/hooks'
import { scrollbarWidth } from '@/utils'

const activeClassName = 'ant-menu-item-selected'
export const StyledNavLink = styled(NavLink).attrs({
  activeClassName,
})`
  width: 0;
`

const Wrapper = styled.div`
  .sider-layout {
  }

  .sider-content {
    /* background: #0c1626 !important; */
    background-color: ${({ theme }) => darken(0.05, theme.black)};
  }
`
const Layout = styled(Layoutd)`
  min-height: 100vh;
  background-color: ${(props) => props.theme.black};
`

const Sider = styled(Layoutd.Sider)<{ collapsed: boolean }>`
  /* flex: 0 0 240px !important;
  max-width: 240px !important;
  min-width: 240px !important;
  width: 240px !important; */

  flex: ${({ collapsed }) => (collapsed ? '0 0 80px !important;' : '0 0 240px !important')};
  max-width: ${({ collapsed }) => (collapsed ? '80px !important;' : '240px !important')};
  min-width: ${({ collapsed }) => (collapsed ? '80px !important;' : '240px !important')};
  width: ${({ collapsed }) => (collapsed ? '80px !important;' : '240px !important')};

  position: fixed;
  top: 0;
  z-index: 11;

  /* padding: 24px 24px 24px; */

  background-color: ${(props) => props.theme.black};
`

const scaleRate = 1.15
const Content = styled(Layoutd.Content)<{ screenWidth: number | undefined }>`
  /* 将整个内容区放大1.15倍 */
  /* transform: scale(${scaleRate});
  transform-origin: 0 0; */

  /* width: ${({ screenWidth }) =>
    // screenWidth ? Math.floor((screenWidth - 240) / scaleRate - ((scrollbarWidth() ?? 2) - 2)) + 'px' : '100%'};
    screenWidth ? ((screenWidth - 240) / scaleRate - ((scrollbarWidth() ?? 2) - 2)).toFixed() + 'px' : '100%'}; */
  /* 内容宽度 / 比例 - 导航条宽度 */
  /* 2为修正偏差值 */

  /* 
   transform已知问题：如果分辨率过大（2000以上），
   会导致右下角出现0.5-1px的白框
  */

  /* zoom也可以解决此问题，但不兼容firefox */
  zoom: 1.15;
  /* 
  * 已解决以下问题。2021-09-24 16:42:20
  * 缩放1.2倍，由于失误将1920设计稿用1440的方式实现，
  * 现需要放大1.2倍
  *
  * 已知问题：
  * 火狐不支持zoom，但transform:scale()无法达到想要的效果，未找到合适的解决方案
  * 
  * 带来后果：火狐浏览器用户看到的右边内容区会比Chrome浏览器看到的小1.2倍
  * 其他用户不受影响
  */

  @media (max-width: ${MEDIUM}) {
    transform: none;
    width: inherit;
    padding: 76px 15px;
    /* padding-bottom: calc(67px + constant(safe-area-inset-bottom));
    padding-bottom: calc(67px + env(safe-area-inset-bottom)); */
  }
`

const ContentLayout = styled(Layoutd)<{ collapsed: boolean }>`
  margin-left: ${({ collapsed }) => (collapsed ? '80px' : '240px')};
  background-color: ${(props) => props.theme.bg1};

  @media (max-width: ${MEDIUM}) {
    margin-left: 0;
  }
`

const Logo = styled.div`
  width: 102px;
  height: 40px;
  margin-left: 8px;

  svg {
    width: 102px;
    height: 40px;
  }
`

const Menu = styled(Menud)`
  border-right: none;
  background-color: ${(props) => props.theme.black};
  color: ${(props) => props.theme.white};

  margin-top: 28px;

  .ant-menu-item-selected,
  .ant-menu-item-submenu-selected {
    background-color: unset !important;
  }

  .ant-menu-item:active {
    /* 去除item点击后的背景色 */
    background-color: unset;
  }
  .ant-menu-item-selected::after {
    /* 去除选中item的小长方条 */
    content: none;
  }

  .ant-menu-item a {
    /* 去除激活a标签的背景色 */
    background-color: unset !important;

    color: ${(props) => props.theme.white};
  }

  /* 切换图标 */
  .ant-menu-item-active,
  .ant-menu-item-selected {
    .home-active-icon {
      background: url(${homeActive}) no-repeat;
    }
    .set-active-icon {
      background: url(${setActive}) no-repeat;
    }
    .single-active-icon {
      background: url(${singleActive}) no-repeat;
    }
    .farm-active-icon {
      background: url(${farmActive}) no-repeat;
    }
    .profile-active-icon {
      background: url(${profileActive}) no-repeat;
    }

    /* 切换文字颜色 */
    a {
      color: ${(props) => props.theme.primary1};
    }
  }

  /* 切换子菜单图标 */
  .ant-menu-submenu-active,
  .ant-menu-submenu-selected {
    .more-active-icon {
      background: url(${moreActive}) no-repeat;
    }
  }

  /* 处理子菜单折叠后按钮样式问题 */
  .ant-menu-submenu-vertical {
    .ant-menu-submenu-title {
      display: flex;
    }
    .-title-content {
      opacity: 0;
    }
  }
`

const SubMenu = styled(SubMenud)`
  background-color: ${(props) => props.theme.black};

  ul,
  li {
    background-color: ${(props) => props.theme.black} !important;
  }
  .ant-menu-submenu-arrow {
    color: ${(props) => props.theme.white};
  }
  .ant-menu-submenu-title:hover,
  .ant-menu-submenu-title:hover .ant-menu-submenu-arrow {
    color: ${(props) => props.theme.primary1};
  }
  .ant-menu-submenu-title:active {
    background-color: unset;
  }
`

const MenuItem = styled.div`
  display: flex;
  align-items: center;

  min-width: 20px;
  overflow: hidden;
`

const IconBase = styled.div<{ collapsed: boolean; iconUrl: string }>`
  background: url(${(props) => props.iconUrl}) no-repeat;
  background-size: 100% 100%;
  width: 20px;
  height: 20px;

  margin-right: ${(props) => (props.collapsed ? 'unset' : '10px')};

  transition: background 0.3s;
`
const SubMenuIcon = styled(IconBase)`
  /* height: 100%; */
  flex: none;
`

const NoticeCardWrapper = styled.div<{ collapsed: boolean }>`
  display: ${({ collapsed }) => (collapsed ? 'none' : 'unset')};
`

const SiderLayout = styled.div<{ collapsed: boolean }>`
  margin: 24px ${({ collapsed }) => (collapsed ? '24px' : 0)} 0 24px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-shrink: 0;
  transition: padding-top 0.2s ease 0s, width 0.2s cubic-bezier(0.4, 0, 0.2, 1) 0s;
  overflow: initial;
  transform: translate3d(0px, 0px, 0px);
`
const SiderHeader = styled.div<{ collapsed: boolean }>`
  overflow: hidden auto;
  height: 100%;
  padding-right: ${({ collapsed }) => (collapsed ? '0' : '44px')};

  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.primary1};
    border-radius: 8px;
  }
  &::-webkit-scrollbar-track {
    /* box-shadow: rgb(238 234 244) 0px 0px 5px inset; */
    border-radius: 10px;
  }
`
const SiderFooter = styled.div<{ collapsed: boolean }>`
  display: ${({ collapsed }) => (collapsed ? 'none' : 'unset')};
  /* margin-top: 100px; */
  margin: 10px 0 20px;

  flex: 0 0 auto;
  /* border-top: 2px solid rgba(133, 133, 133, 0.1); */
`
const Profile = styled.div`
  width: 100%;

  svg {
    cursor: pointer;
  }
`

const SheepPrice = styled.div`
  display: flex;
  align-items: center;
  width: fit-content;

  margin-top: 30px;
  margin-bottom: 24px;
  cursor: pointer;

  &:hover .brand-icon {
    transform: scale(1.2);
  }
`
// const BrandIcon = styled(SheepIcon)`
const BrandIcon = styled.div`
  width: 20px;
  height: 20px;

  background-image: url(${brandIconUrl});
  background-repeat: no-repeat;
  background-size: 100% 100%;

  transition: transform 0.3s;
`
const CurrentPrice = styled.div`
  font-size: 18px;

  color: ${(props) => props.theme.white};

  margin-left: 12px;
`
const DivLine = styled.div`
  height: 1px;
  background: ${(props) => lighten(0.1, props.theme.black)};
`

const ProfileMenu = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  height: 60px;
`

const Header = styled.div<{ collapsed: boolean }>`
  display: flex;
  align-items: center;
  padding: ${({ collapsed }) => (collapsed ? '0 calc(50% - 16px / 2)' : '0px 24px')};
`
const CollapseIconWrapper = styled.div`
  width: 20px;
  height: 20px;
  cursor: pointer;
  margin-right: 10px;
`

const routerList: Record<string, string> = {
  '/home': '0',
  '/set': '1',
  '/single-farm': '2',
  '/farm': '3',
  '/profile': '4',
  '/more': '5',
}

function AppLayout({ children }: { children: any }) {
  // 折叠导航栏用
  const [collapsed, setCollapsed] = useState<boolean>(false)

  // pretend load buffer
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    setTimeout(() => setLoading(false), 1300)
  }, [])

  // 导航菜单跟随路由变化
  const location = useLocation()
  const selectKeys = useMemo(() => {
    const route = location?.pathname
    if (!route) return []
    return [routerList[route]]
  }, [location])

  // const homeData = useHomeData()
  // const spcPrice = useMemo(() => homeData?.[0]?.spc_price, [homeData])

  const isPc = useIsPcByScreenWidth()
  const screenWidth = useScreenWidth()

  useEffect(() => {
    console.debug('isPc', isPc)
  }, [isPc])

  return (
    <Wrapper>
      {/* {loading ? (
        <LocalLoader fill={false} full={true} />
      ) : ( */}
      <Layout className="sider-layout">
        {isPc && (
          <Sider trigger={null} collapsible collapsed={collapsed} className="sider-sider">
            <SiderLayout collapsed={collapsed}>
              <SiderHeader collapsed={collapsed}>
                <Header collapsed={collapsed}>
                  <CollapseIconWrapper
                    onClick={() => {
                      setCollapsed((prev: any) => !prev)
                    }}
                  >
                    {collapsed ? <CollapsedIcon /> : <CollapseIcon />}
                  </CollapseIconWrapper>
                  <Logo style={{ opacity: collapsed ? '0' : '1' }}>
                    <Icon.Logo />
                  </Logo>
                </Header>

                <Menu
                  mode="inline"
                  defaultSelectedKeys={selectKeys}
                  selectedKeys={selectKeys}
                  // onOpenChange={submenuChangeHandler}
                  // onSelect={menuSelectHandler}
                >
                  {/* <Menu.Item key="0" icon={<Icon.Home />}> */}
                  <Menu.Item key="0">
                    <MenuItem>
                      <IconBase className="home-active-icon" collapsed={collapsed} iconUrl={home}></IconBase>
                      <StyledNavLink to="/home">Home</StyledNavLink>
                    </MenuItem>
                  </Menu.Item>
                  <Menu.Item key="1">
                    <MenuItem>
                      <IconBase className="set-active-icon" collapsed={collapsed} iconUrl={set}></IconBase>
                      <StyledNavLink to="/set">聚合流动性</StyledNavLink>
                    </MenuItem>
                  </Menu.Item>
                  <Menu.Item key="2">
                    <MenuItem>
                      <IconBase className="single-active-icon" collapsed={collapsed} iconUrl={single}></IconBase>
                      <StyledNavLink to="/single-farm">单币挖矿</StyledNavLink>
                    </MenuItem>
                  </Menu.Item>
                  <Menu.Item key="3">
                    <MenuItem>
                      <IconBase className="farm-active-icon" collapsed={collapsed} iconUrl={farm}></IconBase>
                      <StyledNavLink to="/farm">流动性挖矿</StyledNavLink>
                    </MenuItem>
                  </Menu.Item>
                  <Menu.Item key="4">
                    <MenuItem>
                      <IconBase className="profile-active-icon" collapsed={collapsed} iconUrl={profile}></IconBase>
                      <StyledNavLink to="/profile">我的</StyledNavLink>
                    </MenuItem>
                  </Menu.Item>

                  <SubMenu
                    key="sub1"
                    icon={
                      // <Icon.More />
                      <SubMenuIcon className="more-active-icon" collapsed={collapsed} iconUrl={more}></SubMenuIcon>
                    }
                    title={'更多'}
                  >
                    <Menu.Item key="100">
                      <a href={Audit} target="_blank" rel="noreferrer">
                        Audit
                      </a>
                    </Menu.Item>
                    <Menu.Item key="101">
                      <a href={Doc} target="_blank" rel="noreferrer">
                        Doc
                      </a>
                    </Menu.Item>
                    <Menu.Item key="102">
                      <a href={Twitter} target="_blank" rel="noreferrer">
                        Twitter
                      </a>
                    </Menu.Item>
                    <Menu.Item key="103">
                      <a href={Telegram} target="_blank" rel="noreferrer">
                        Telegram
                      </a>
                    </Menu.Item>
                    <Menu.Item key="104">
                      <a href={ContactUs} target="_blank" rel="noreferrer">
                        Contact us
                      </a>
                    </Menu.Item>
                  </SubMenu>
                </Menu>
                {/* <NoticeCardWrapper collapsed={collapsed}>公告</NoticeCardWrapper> */}
              </SiderHeader>

              <SiderFooter collapsed={collapsed}>
                <Profile>
                  <SheepPrice>
                    <BrandIcon className="brand-icon" />
                    {/* <SheepIcon>
                      <img src={sheepIcon} alt="" />
                    </SheepIcon> */}
                    <CurrentPrice>${computeNumUnit(8.33)}</CurrentPrice>
                  </SheepPrice>
                  <DivLine />
                  <ProfileMenu>
                    <LangCrad />
                  </ProfileMenu>
                </Profile>
              </SiderFooter>
            </SiderLayout>
          </Sider>
        )}
        <ContentLayout collapsed={collapsed}>
          <Content className="sider-content" screenWidth={screenWidth}>
            {children}
          </Content>
        </ContentLayout>
      </Layout>
      {/* )} */}
    </Wrapper>
  )
}

export default memo(AppLayout)
