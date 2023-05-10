import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import BasicLayout from '../layouts/BasicLayout.vue';
import BlankLayout from '../layouts/BlankLayout.vue';
import WelcomePage from '../views/Hello.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'index',
    meta: { title: 'Home' },
    component: BasicLayout,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        name: 'welcome',
        meta: { title: '欢迎', icon: 'SmileOutlined' },
        component: WelcomePage,
      },
      {
        path: '/dashboard',
        name: 'dashboard',
        meta: { title: '管理页', icon: 'CrownOutlined' },
        redirect: '/dashboard/monitor',
        component: BlankLayout,
        children: [
          {
            path: '/dashboard/workspace',
            name: 'workspace',
            meta: { title: '一级页面' },
            component: () => import('../views/TestPage.vue'),
          },
          {
            path: '/dashboard/monitor',
            name: 'monitor',
            meta: { title: '二级页面' },
            component: () => import('../views/MyPage.vue'),
          },
        ],
      },
      {
        path: '/list',
        name: 'list',
        meta: { title: '列表页', icon: 'MobileOutlined' },
        redirect: '/list/child2',
        component: BlankLayout,
        children: [
          {
            path: 'child1',
            name: 'list-child1',
            meta: { title: '一级列表页面' },
            component: BlankLayout,
            children: [
              {
                path: 'child1',
                name: 'list-child1-child1',
                meta: {
                  title: '一一级列表页面',
                  // attach `params` to `$route.params`
                  params: {
                    id: 1,
                  },
                },
                component: () => import('../views/DynamicPage.vue'),
              },
              {
                path: 'child2',
                name: 'list-child1-child2',
                meta: {
                  title: '二一级列表页面',
                  // attach `params` to `$route.params`
                  params: {
                    id: 2,
                  },
                },
                component: () => import('../views/DynamicPage.vue'),
              },
              {
                path: 'child3',
                name: 'list-child1-child3',
                meta: {
                  title: '三一级列表页面',
                  // attach `params` to `$route.params`
                  params: {
                    id: 3,
                  },
                },
                component: () => import('../views/DynamicPage.vue'),
              },
            ],
          },
          {
            path: 'child2',
            name: 'list-child2',
            meta: { title: '二级列表页面' },
            component: () => import('../views/TestPage.vue'),
          },
          {
            path: 'child3',
            name: 'list-child3',
            meta: { title: '三级列表页面' },
            component: () => import('../views/TestPage.vue'),
          },
        ],
      },
      {
        path: '/test-tab',
        name: 'TestTab',
        meta: { title: '测试Tab标签', hideInMenu: false },
        component: () => import('../views/TestTab.vue'),
      },
      {
        path: 'https://next.antdv.com/',
        name: 'baidu_target',
        meta: { title: 'Ant Design Vue 官网', icon: 'link-outlined', target: '_blank' },
        component: null,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
