import { RouteProps } from '../src/typings';

export const menus: RouteProps[] = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    meta: { icon: 'dashboard-outlined', title: 'Dashboard' },
    children: [
      {
        path: '/dashboard/analysis',
        name: 'Analysis',
        meta: { icon: 'SmileOutlined', title: 'Analysis' },
      },
      {
        path: '/dashboard/monitor',
        name: 'Monitor',
        meta: { icon: 'SmileOutlined', title: 'Monitor' },
      },
      {
        path: '/dashboard/workplace',
        name: 'Workplace',
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
]
