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
}

const routes: {
  [route: string]: string
} = {
  '/home': Route.Home + '', //to string
  '/strategy': Route.Strategy + '',
  '/contract': Route.Contract + '',
  // '/multiSign': Route.MultiSign + '',
  '/transactionList': Route.TransactionList + '',
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
        <Menu.Item key={Route.Contract} icon={<DesktopOutlined />}>
          <StyledNavLike to="/contract">
            <TYPE.main color="white">合约助手</TYPE.main>
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
      </Menu>
    </Sider>
  )
}
