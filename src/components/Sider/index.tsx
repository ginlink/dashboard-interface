import React, { useState, useCallback } from 'react'

import { Layout, Menu, Breadcrumb } from 'antd'
import { DesktopOutlined, PieChartOutlined, FileOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons'
import styled from 'styled-components/macro'
import { TYPE } from '@/theme'
import { NavLink } from 'react-router-dom'

const { Sider } = Layout
const { SubMenu } = Menu

const SiderLogo = styled.div`
  height: 32px;
  margin: 16px;
  background: rgba(255, 255, 255, 0.3);
`

const StyledNavLike = styled(NavLink)``

export default function Siders() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
      <SiderLogo />
      <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
        <Menu.Item key="1" icon={<PieChartOutlined />}>
          <StyledNavLike to="/home">
            <TYPE.main color="white">首页</TYPE.main>
          </StyledNavLike>
        </Menu.Item>
        <Menu.Item key="2" icon={<DesktopOutlined />}>
          <StyledNavLike to="/contract">
            <TYPE.main color="white">合约助手</TYPE.main>
          </StyledNavLike>
        </Menu.Item>
      </Menu>
    </Sider>
  )
}
