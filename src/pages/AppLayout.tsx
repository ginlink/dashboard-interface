import React from 'react'
import { Layout } from 'antd'
import styled from 'styled-components'

import Header from '../components/Header'
import Sider from '../components/Sider'
import Popups from '@/components/Popups'

const { Content } = Layout

const HeaderBar = styled.div`
  height: 60px;
  background: #fff;
`

const LayoutContent = styled.div`
  background: #fff;
  padding: 24px;
  min-height: 100%;
`
export default function AppLayout({ children }: { children: any }) {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider />
      <Layout className="site-layout">
        <HeaderBar>
          <Header />
        </HeaderBar>

        <Popups />
        <Content style={{ margin: '16px 16px' }}>
          <LayoutContent>{children}</LayoutContent>
        </Content>
      </Layout>
    </Layout>
  )
}
