import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import VitepressDemo from 'vite-plugin-vitepress-demo'
import Unocss from 'unocss/vite'
// @ts-expect-error this is
const __dir = fileURLToPath(new URL(import.meta.url))
const pkgPath = path.resolve(__dir, '../../../packages')
export default () =>
  defineConfig({
    plugins: [
      vueJsx(),
      VitepressDemo({
        glob: ['**/demo/**/*.vue']
      }),
      Unocss()
    ],
    resolve: {
      alias: {
        '@ant-design-vue/pro-provider': path.resolve(pkgPath, 'provider/src'),
        '@ant-design-vue/pro-field': path.resolve(pkgPath, 'field/src'),
        '@ant-design-vue/pro-form': path.resolve(pkgPath, 'form/src'),
        '@ant-design-vue/pro-utils': path.resolve(pkgPath, 'utils/src'),
        '@ant-design-vue/pro-table': path.resolve(pkgPath, 'table/src')
      }
    },
    ssr: {
      noExternal: ['ant-design-vue']
    }
  })
