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
        meta: { title: 'Dashboard' },
        redirect: '/dashboard/monitor',
        component: RouteView,
        children: [
          {
            path: 'workspace',
            name: 'workspace',
            meta: { title: 'Dashboard', icon: 'SettingOutlined' },
            component: () => import('./views/page1.vue'),
          },
          {
            path: 'monitor',
            name: 'monitor',
            meta: { title: 'Monitor', icon: 'DatabaseOutlined' },
            component: () => import('./views/page2.vue'),
          },
        ],
      },
    ],
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
