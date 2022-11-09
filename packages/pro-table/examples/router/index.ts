import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import BasicLayout from '../layouts/BasicLayout.vue';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'index',
        meta: { title: 'Home' },
        component: BasicLayout
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});

export default router;
