// eslint-disable-next-line
import BasicLayout from '../layouts/BasicLayout.vue'

const RouteView = {
  name: 'RouteView',
  render: (h) => h('router-view')
}

const asyncRouterMap = [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: 'menu.home' },
    redirect: '/dashboard/analysis',
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        meta: { keepAlive: true, title: 'menu.dashboard.default', icon: 'dashboard' },
        redirect: '/dashboard/analysis',
        component: RouteView,
        children: [
          {
            path: '/dashboard/analysis',
            name: 'analysis',
            meta: {
              keepAlive: true,
              icon: 'smile',
              title: 'menu.dashboard.analysis'
            },
            component: () => import(/* webpackChunkName: "dashboard" */ '../views/dashboard/analysis')
          },
          {
            path: '/dashboard/workplace/:id?',
            name: 'workplace',
            meta: {
              global: true,
              keepAlive: true,
              icon: 'smile',
              title: 'menu.dashboard.workplace'
            },
            component: () => import(/* webpackChunkName: "dashboard" */ '../views/dashboard/workplace')
          }
        ]
      },
      {
        path: '/form',
        name: 'form',
        meta: {
          keepAlive: true,
          title: 'menu.form.default',
          icon: 'video-camera'
        },
        component: RouteView,
        children: [
          {
            path: '/form/basic-form',
            name: 'basic-form',
            meta: {
              keepAlive: true,
              icon: 'smile',
              title: 'menu.form.basicform'
            },
            component: () => import(/* webpackChunkName: "about" */ '../views/form/basic-form')
          },
          {
            path: '/form/step-form',
            name: 'step-form',
            meta: {
              keepAlive: true,
              icon: 'smile',
              title: 'menu.form.stepform'
            },
            component: () => import(/* webpackChunkName: "about" */ '../views/form/step-form')
          },
          {
            path: '/form/advanced-form',
            name: 'advanced-form',
            meta: {
              keepAlive: true,
              icon: 'smile',
              title: 'menu.form.advancedform'
            },
            component: () => import(/* webpackChunkName: "about" */ '../views/form/advanced-form')
          }
        ]
      },
      {
        path: '/page1',
        name: 'page1',
        meta: {
          keepAlive: true,
          title: 'menu.nav1',
          icon: 'smile'
        },
        component: () => import(/* webpackChunkName: "about" */ '../views/TestPage1')
      },
      {
        path: '/page2',
        name: 'page2',
        meta: {
          keepAlive: true,
          title: 'menu.nav2',
          icon: 'smile'
        },
        component: () => import(/* webpackChunkName: "about" */ '../views/TestPage2')
      },
      {
        path: '/page3',
        name: 'page3',
        meta: {
          keepAlive: true,
          title: 'menu.nav3',
          icon: 'smile'
        },
        component: () => import(/* webpackChunkName: "about" */ '../views/TestPage3')
      },
      {
        path: 'http://www.baidu.com/',
        name: 'remote-baidu',
        meta: {
          title: '百度',
          icon: 'smile',
          target: '_blank'
        }
      }
    ]
  }
]

export { asyncRouterMap }
