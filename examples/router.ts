import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import BasicLayout from './layouts/BasicLayout.vue';
import RouteView from './layouts/RouteView.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'index',
    meta: { title: 'Home' },
    component: BasicLayout,
    redirect: '/dashboard',
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        meta: { title: 'Dashboard', icon: 'DashboardOutlined' },
        redirect: '/dashboard/monitor',
        component: RouteView,
        children: [
          {
            path: '/dashboard/workspace',
            name: 'workspace',
            meta: { title: 'Workspace', icon: 'icon-antdesign' },
            component: () => import('./views/page1.vue'),
          },
          {
            path: '/dashboard/monitor',
            name: 'monitor',
            meta: { title: 'Monitor', icon: 'icon-icon-test' },
            component: () => import('./views/page2.vue'),
          },
        ],
      },
      {
        path: '/form',
        name: 'form',
        meta: { title: 'Form', icon: 'FormOutlined' },
        redirect: '/form/basic-form',
        component: RouteView,
        children: [
          {
            path: 'basic-form',
            name: 'basic-form',
            meta: { title: 'Basic Form' },
            component: () => import('./views/page1.vue'),
          },
          {
            path: 'description-form/:id(\\d+)?',
            name: 'description-form',
            meta: {
              title: 'Description',
              // attach `params` to `$route.params`
              params: {
                id: 2,
              },
            },
            component: () => import('./views/dynamic-page.vue'),
          },
        ],
      },
      {
        path: '/single',
        name: 'single',
        meta: { title: 'Single', icon: 'SettingOutlined' },
        component: () => import('./views/page1.vue'),
      },
      {
        path: 'http://www.baidu.com/',
        name: 'baidu_target',
        meta: { title: '百度一下', target: '_blank' },
        component: null,
      },
    ],
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
