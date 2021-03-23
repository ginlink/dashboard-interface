
import {Route,Redirect,Switch} from "react-router-dom"

const generateMenuList = (menu) => {
    let routeList = []
    menu.forEach(item=>{
        if(item.children) routeList = routeList.concat(generateMenuList(item.children)) 
        else if(item.redirect){}
        else routeList.push(item)
    })
    return routeList
}

const generateRedirectMenu = (menu) => {
    let redirectMenu = []
    menu.forEach(item=>{
        if(item.children) redirectMenu = redirectMenu.concat(generateRedirectMenu(item.children) )
        if(item.redirect) redirectMenu.push(item)
    })
    return redirectMenu
}

const RouterView = ({menu})=>{
    // console.log(menu)
    return(
            <Switch>
                {(()=>{
                    const routeMenu = generateMenuList(menu).map(item=>(
                        <Route key={item.path} path={item.path} exact component={item.component}></Route>
                    ))
                    const redirectMenu = generateRedirectMenu(menu).map(item=>(
                        <Redirect key={item.path} to={item.redirect} path={item.path} exact ></Redirect>
                    ))
                    return [...routeMenu , ...redirectMenu , <Redirect key="//" to={menu[0].redirect} path="/"></Redirect>]
                })()}
            </Switch>
    )
}

export default RouterView
