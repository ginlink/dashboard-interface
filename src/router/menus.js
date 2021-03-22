import { lazy } from 'react'
const menus = [
  { 
    path: '/',
    key: '/',
    redirect: '/investment',
    meta: { 
      hidden: true
    }
  },
  {
    path: '/investment',
    key: '0-0',
    title: '投资',
    component: lazy(() => import('./../views//investment/Investment'))
  },
  {
    path: '/AutomaticInvestment',
    key: '0-1',
    title: '自动化投资',
    component: lazy(() => import('../views/automaticInvestment/AutomaticInvestment'))
  },
]

export default  menus