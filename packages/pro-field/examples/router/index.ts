import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import Demo from '@/views/test.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'index',
    meta: { title: 'Home' },
    redirect: '/demo',
    children: [
      {
        path: '/demo',
        name: 'demo',
        meta: { title: '欢迎', icon: 'SmileOutlined' },
        component: Demo,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
