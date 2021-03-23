import { Link } from "react-router-dom"
import { Menu } from 'antd';
 
 const SiderMenu = ({menu,defaultSelectedKeys}) => {
     return (
         <div>
             <span>{defaultSelectedKeys}</span>
             <Menu 
                theme="dark" 
                mode="inline" 
                defaultSelectedKeys={defaultSelectedKeys}
                >
                {menu.map( item => (
                (item.meta && item.meta.hidden) ? 
                null :
                (       
                        <Menu.Item 
                        key={item.key} 
                        icon={item.icon} 
                        onClick={()=>{
                            console.log(item.key)
                            sessionStorage.setItem("defaultSelectedKeys", item.key);
                        }}>
                            <Link to={item.path}>
                                {item.title}
                            </Link>
                        </Menu.Item>
                )))}
            </Menu>
         </div>
        
     )
 }

 export default SiderMenu