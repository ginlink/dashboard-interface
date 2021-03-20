import { Link , Switch , Route , Redirect , withRouter } from "react-router-dom"

import React from "react"
import { Layout, Menu } from 'antd';

import "./index.css"
import menus from "./../../router/menus"


const { Header, Content, Sider } = Layout;

class Index extends React.Component {
    state = {
      collapsed: false,
    };
  
    onCollapse = collapsed => {
      console.log(collapsed);
      this.setState({ collapsed });
    };
  
    render() {
      const { collapsed } = this.state;
      return (
        <Layout style={{ minHeight: '100vh' }}>
          <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
            <div className="logo" />
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
              {menus.map( item => (
                (item.meta && item.meta.hidden) ? 
                null :
                (   
                        <Menu.Item key={item.key} icon={item.icon}>
                            <Link to={item.path}>
                                {item.title}
                            </Link>
                        </Menu.Item>
                )) )}
            </Menu>
          </Sider>
          <Layout className="site-layout">
            <Header className="site-layout-background" style={{ padding: 0 }} >
                <div className="header">
                    <span>POOL INFO</span>
                    <div>
                        <span className="headerButton" > 一键EARN </span>
                        <span className="headerButton"> 一键HARVEST </span>
                    </div>
                </div>
            </Header>
            <Content style={{ margin: '0 16px' }}>
                <Switch>
                    {
                        menus.map( item=>(
                            item.redirect 
                            ? 
                            <Redirect key={item.key} path={item.path} to={item.redirect} exact></Redirect> 
                            : 
                            <Route key={item.key} exact path={item.path} component={item.component}></Route>
                        ) )
                    }
                </Switch>
            </Content>
          </Layout>
        </Layout>
      );
    }
  }

  export default withRouter( Index )