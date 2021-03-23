
import { Link , withRouter } from "react-router-dom"

import React , {useState , useEffect} from "react"
import { Layout } from 'antd';

import "./index.css"
import menus from "./../../router/menus"
import SiderMenu from "./../sidermenu/siderMenu"
import RouterView from "./../../router/routerView"


const { Content, Sider } = Layout;

const Index = ()=> {
    const [collapsed , setCollapsed] = useState(false)
    const [defaultSelectedKeys,setDefaultSelectedKeys] = useState(["0-0"])
    let flag = true

    // useEffect(()=>{
    //   const defaultSelectedKey = sessionStorage.getItem('defaultSelectedKeys')
    //   if(defaultSelectedKey && flag ){
    //     flag = false
    //     setDefaultSelectedKeys([defaultSelectedKey])
    //   }
    // },[])

    const dfsk = sessionStorage.getItem("defaultSelectedKeys")
    setDefaultSelectedKeys([dfsk])

    console.log(defaultSelectedKeys)
    
    const onCollapse = collapsed => {
      setCollapsed(collapsed)
    };

      return (
        <Layout style={{ minHeight: '100vh' }}>
          <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
            <div className="logo" />
            <SiderMenu menu={menus} defaultSelectedKeys={defaultSelectedKeys} />
          </Sider>
          <Layout className="site-layout">
            <Content style={{ margin: '0 16px' }}>
              <RouterView menu={menus}/>
            </Content>
          </Layout>
        </Layout>
      );
  }

  export default withRouter( Index )