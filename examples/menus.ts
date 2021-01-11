import { RouteProps } from '../src/typings';

export const menus: RouteProps[] = [
  {
    path: '/welcome',
    name: 'welcome',
    meta: { icon: 'SmileOutlined', title: 'Welcome' },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    meta: { icon: 'dashboard-outlined', title: 'Dashboard' },
    children: [
      {
        path: '/dashboard/analysis',
        name: 'analysis',
        meta: { icon: 'SmileOutlined', title: 'Analysis' },
      },
      {
        path: '/dashboard/monitor',
        name: 'monitor',
        meta: { icon: 'SmileOutlined', title: 'Monitor' },
      },
      {
        path: '/dashboard/workplace',
        name: 'workplace',
        meta: { icon: 'SmileOutlined', title: 'Workplace' },
      },
    ],
  },
  {
    path: '/form',
    name: 'form',
    meta: { title: 'Form', icon: 'SmileOutlined' },
    children: [
      {
        path: '/form/basic-form',
        name: 'basic-form',
        meta: { icon: 'SmileOutlined', title: 'Basic Form' },
      },
      {
        path: '/form/step-form',
        name: 'step-form',
        meta: { icon: 'SmileOutlined', title: 'Step Form' },
      },
      {
        path: '/form/advanced-form',
        name: 'advance-form',
        meta: { icon: 'SmileOutlined', title: 'Advanced Form' },
      },
    ],
  },
];
