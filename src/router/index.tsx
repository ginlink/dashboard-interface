import React from 'react'
import { Button } from 'antd'
import Loadable from 'react-loadable'

const Loading = (props: any) => {
  if (props.error) {
    console.log(props.error)
    return (
      <div>
        Error!{' '}
        <Button type="link" onClick={props.retry}>
          Retry
        </Button>
      </div>
    )
  } else if (props.timedOut) {
    return (
      <div>
        Timeout! <Button onClick={props.retry}>Retry</Button>
      </div>
    )
  } else if (props.pastDelay) {
    return <div>Loading...</div>
  } else {
    return null
  }
}
// 路由懒加载
const loadable = (path: any) => {
  return Loadable({
    loader: () => import(`../${path}`),
    loading: Loading,
    delay: 200,
    timeout: 10000,
  })
}

const routes = [
  {
    path: '/home',
    component: loadable('pages/Home'),
    exact: true,
  },
  {
    path: '/tables',
    component: loadable('pages/Tables'),
  },
  {
    path: '/new',
    component: loadable('components/New'),
    redirect: '/new/list',
    // exact: true,
    routes: [
      {
        path: '/new/list',
        component: loadable('components/NewList'),
        exact: true,
      },
      {
        path: '/new/content',
        component: loadable('components/NewContent'),
        exact: true,
      },
    ],
  },
  {
    path: '/set',
    component: loadable('pages/Set'),
    exact: true,
  },
  {
    path: '/single-farm',
    component: loadable('pages/SingleFarm'),
    exact: true,
  },
  {
    path: '/farm',
    component: loadable('pages/Farm'),
    exact: true,
  },
  {
    path: '/profile',
    component: loadable('pages/Profile'),
    exact: true,
  },
]

export default routes
