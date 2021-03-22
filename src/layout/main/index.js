import { Link , Switch , Route , Redirect , withRouter } from "react-router-dom"

import React from "react"
import { Layout, Menu } from 'antd';

import "./index.css"
import menus from "./../../router/menus"


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
      console.log(collapsed);
      this.setState({ collapsed });
    };

  
    render() {
      const { collapsed } = this.state;
      return (
        <Layout style={{ minHeight: '100vh' }}>
          <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
            <div className="logo" />
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" defaultSelectedKeys={this.state.defaultSelectedKeys}>
              {menus.map( item => (
                (item.meta && item.meta.hidden) ? 
                null :
                (   
                        <Menu.Item 
                        key={item.key} 
                        icon={item.icon}
                        onClick={()=>{
                          sessionStorage.setItem("defaultSelectedKeys", [item.key]);
                        }}>
                            <Link to={item.path}>
                                {item.title}
                            </Link>
                        </Menu.Item>
                )) )}
            </Menu>
          </Sider>
          <Layout className="site-layout">
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
                    <Redirect key="/" path="/"  to="/investment" ></Redirect> 
                </Switch>
            </Content>
          </Layout>
        </Layout>
      );
    }
  }

  export default withRouter( Index )