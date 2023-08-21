import { defineConfig } from 'vitepress'
import type { UserConfig } from 'vite'
import { getNav } from './config/nav'
import { getSideBar } from './config/sidebar'
import { getRewrites } from './config/rewrites'
import viteConfig from './config/vite'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Antd Vue Pro',
  description: 'Antd Vue Pro Components',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: getNav(),
    sidebar: getSideBar(),
    // sidebar: [
    //   {
    //     text: 'Examples',
    //     items: [
    //       { text: 'Markdown Examples', link: '/markdown-examples' },
    //       { text: 'Runtime API Examples', link: '/api-examples' }
    //     ]
    //   }
    // ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/antdv-pro/pro-components' }
    ]
  },
  rewrites: getRewrites(),
  // @ts-expect-error this is vite
  vite: viteConfig() as UserConfig
})
