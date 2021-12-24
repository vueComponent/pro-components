import { resolve } from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import vueLess from './scripts/vite/less';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx({
      mergeProps: false,
      enableObjectSlots: false,
    }),
    vueLess(),
  ],
  resolve: {
    alias: {
      '@ant-design-vue/pro-layout': resolve(__dirname, 'src'),
      '@': resolve(__dirname, 'src'),
      'vue': 'vue/dist/vue.esm-bundler.js',
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ProLayout',
    },
    rollupOptions: {
      external: [
        'vue',
        'vue-router',
        '@ant-design/icons-vue',
        '@ant-design/icons-svg',
        'ant-design-vue',
        'antd',
        'moment',
      ],
      output: {
        exports: 'named',
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue',
          'vue-router': 'VueRouter',
          'ant-design-vue': 'antd',
          '@ant-design/icons-vue': 'iconsVue',
          '@ant-design/icons-svg': 'iconsSvg',
          'antd': 'antd',
          moment: 'moment',
        },
      },
    },
  },
  optimizeDeps: {
    include: ['ant-design-vue', '@ant-design/icons-vue', 'lodash-es'],
  },
  css: {
    postcss: {},
    preprocessorOptions: {
      less: {
        // DO NOT REMOVE THIS LINE
        javascriptEnabled: true,
        modifyVars: {
          hack: `true; @import 'ant-design-vue/es/style/themes/default.less'`,
        }
      },
    },
  },
});
