import React, { useState, useCallback, useMemo } from 'react'

import { Layout, Menu, Breadcrumb } from 'antd'
import { DesktopOutlined, PieChartOutlined, FileOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons'
import styled from 'styled-components/macro'
import { TYPE } from '@/theme'
import { NavLink, useLocation } from 'react-router-dom'

const { Sider } = Layout
const { SubMenu } = Menu

const SiderLogo = styled.div`
  height: 32px;
  margin: 16px;
  background: rgba(255, 255, 255, 0.3);
`

const StyledNavLike = styled(NavLink)``

enum Route {
  Home = 1,
  Strategy = 2,
  Contract = 3,
  // MultiSign = 4,
  TransactionList = 4,
  FastCall,
  CallAdmin,
  CtAddress,
}

const routes: {
  [route: string]: string
} = {
  '/home': Route.Home + '', //to string
  '/strategy': Route.Strategy + '',
  '/contract': Route.Contract + '',
  // '/multiSign': Route.MultiSign + '',
  '/transactionList': Route.TransactionList + '',
  '/fast_call': Route.FastCall + '',
  '/call_admin': Route.CallAdmin + '',
  '/ct_address': Route.CtAddress + '',
}

export default function Siders() {
  const [collapsed, setCollapsed] = useState(false)

  // 导航菜单跟随路由变化
  const location = useLocation()
  const selectKeys = useMemo(() => {
    const route = location?.pathname
    if (!route) return []

    return [routes[route]]
  }, [location])

  return (
    <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
      <SiderLogo />
      <Menu theme="dark" defaultSelectedKeys={selectKeys} selectedKeys={selectKeys} mode="inline">
        <Menu.Item key={Route.Home} icon={<PieChartOutlined />}>
          <StyledNavLike to="/home">
            <TYPE.main color="white">首页</TYPE.main>
          </StyledNavLike>
        </Menu.Item>
        <Menu.Item key={Route.Strategy} icon={<PieChartOutlined />}>
          <StyledNavLike to="/strategy">
            <TYPE.main color="white">策略列表</TYPE.main>
          </StyledNavLike>
        </Menu.Item>
        {/* <Menu.Item key={Route.MultiSign} icon={<PieChartOutlined />}>
          <StyledNavLike to="/multiSign">
            <TYPE.main color="white">多签</TYPE.main>
          </StyledNavLike>
        </Menu.Item> */}
        <Menu.Item key={Route.TransactionList} icon={<PieChartOutlined />}>
          <StyledNavLike to="/transactionList">
            <TYPE.main color="white">事务列表</TYPE.main>
          </StyledNavLike>
        </Menu.Item>

        <SubMenu key={'100'} icon={<DesktopOutlined />} title="合约助手">
          <Menu.Item key={Route.FastCall}>
            <StyledNavLike to="/fast_call">
              <TYPE.main color="white">快速调用</TYPE.main>
            </StyledNavLike>
          </Menu.Item>
          <Menu.Item key={Route.CallAdmin}>
            <StyledNavLike to="/call_admin">
              <TYPE.main color="white">管理调用</TYPE.main>
            </StyledNavLike>
          </Menu.Item>
          <Menu.Item key={Route.CtAddress}>
            <StyledNavLike to="/ct_address">
              <TYPE.main color="white">常用地址</TYPE.main>
            </StyledNavLike>
          </Menu.Item>
        </SubMenu>
      </Menu>
    </Sider>
  )
}
