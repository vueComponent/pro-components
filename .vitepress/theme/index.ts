// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme as ThemeType } from 'vitepress'
import { AntdTheme } from 'vite-plugin-vitepress-demo/theme'
import Theme from 'vitepress/theme'
import ThemeLayout from '../components/Layout.vue'
import './style.css'
import 'uno.css'

export default {
  ...Theme,
  Layout: () => {
    return h(ThemeLayout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp(ctx) {
    // ...
    if (!import.meta.env.SSR) {
      ctx.app.component('Demo', AntdTheme)
    }
  }
} as ThemeType
