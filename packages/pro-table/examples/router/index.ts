import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import BasicLayout from '../layouts/BasicLayout.vue';
import BlankLayout from '../layouts/BlankLayout.vue';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'index',
        meta: { title: 'Home' },
        component: BasicLayout,
        redirect: '/table',
        children: [
            {
                path: '/table',
                name: 'table',
                meta: { title: 'table页面', icon: 'CrownOutlined' },
                redirect: '/table/ProTable',
                component: BlankLayout,
                children: [
                    {
                        path: '/table/ProTable',
                        name: 'ProTable',
                        meta: { title: 'ProTable' },
                        component: () => import('../views/ProTable.vue')
                    },
                    {
                        path: '/table/EditableProTable',
                        name: 'EditableProTable',
                        meta: { title: 'EditableProTable' },
                        component: () => import('../views/EditableProTable.vue')
                    }
                ]
            },
            {
                path: 'https://next.antdv.com/',
                name: 'baidu_target',
                meta: { title: 'Ant Design Vue 官网', icon: 'link-outlined', target: '_blank' },
                component: null
            }
        ]
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});

export default router;
