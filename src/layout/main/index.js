import { Link , withRouter } from "react-router-dom"

import React from "react"
import { Layout } from 'antd';

import "./index.css"
import menus from "./../../router/menus"
import SiderMenu from "./../sidermenu/siderMenu"
import RouterView from "./../../router/routerView"


const { Content, Sider } = Layout;

class Index extends React.Component {
    state = {
      collapsed: false,
      defaultSelectedKeys:["0-0"]
    };

    componentWillMount(){
      const defaultSelectedKeys = sessionStorage.getItem('defaultSelectedKeys')
      console.log(defaultSelectedKeys)
      if( defaultSelectedKeys ){
        this.setState({
          defaultSelectedKeys:[defaultSelectedKeys]
        })
      }
    }
  
    onCollapse = collapsed => {
      this.setState({ collapsed });
    };

    render() {
      const { collapsed } = this.state;
      return (
        <Layout style={{ minHeight: '100vh' }}>
          <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
            <div className="logo" />
            <SiderMenu menu={menus} defaultSelectedKeys={this.state.defaultSelectedKeys} />
          </Sider>
          <Layout className="site-layout">
            <Content style={{ margin: '0 16px' }}>
              <RouterView menu={menus}/>
            </Content>
          </Layout>
        </Layout>
      );
    }
  }

  export default withRouter( Index )