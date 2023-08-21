import type { DefaultTheme } from 'vitepress'
export const getNav = (): DefaultTheme.NavItem[] => {
  return [
    {
      text: '指引',
      link: '/guide/introduce'
    },
    {
      text: '组件',
      items: [
        {
          text: 'pro-field',
          link: '/field/'
        },
        {
          text: 'pro-form',
          link: '/form/'
        },
        {
          text: 'pro-table',
          link: '/table/'
        },
        {
          text: 'pro-provider',
          link: '/provider/'
        }
      ]
    }
  ]
}
