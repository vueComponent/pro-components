import { fileURLToPath, URL } from 'url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import typescript from '@rollup/plugin-typescript';
import lessCopy from '@shared/vite-plugin-less-copy';
import { createStyleImportPlugin, AndDesignVueResolve } from 'vite-plugin-style-import';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    lessCopy(),
    createStyleImportPlugin({
      resolves: [AndDesignVueResolve()],
    }),
  ],
  resolve: {
    alias: {
      '@ant-design-vue/pro-field': fileURLToPath(new URL('./src', import.meta.url)),
      '@': fileURLToPath(new URL('./examples', import.meta.url)),
    },
  },
  css: {
    postcss: {},
    preprocessorOptions: {
      less: {
        // DO NOT REMOVE THIS LINE
        javascriptEnabled: true,
        // modifyVars: {
        //   hack: `true; @import 'ant-design-vue/es/style/themes/default.less'`,
        // }
      },
    },
  },
  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/index.tsx', import.meta.url)),
      name: 'ProField',
    },
    rollupOptions: {
      external: ['vue', 'vue-router', 'ant-design-vue', 'vue-types'],
      output: {
        exports: 'named',
        // Provide global variables to use in the UMD build
        // for externalized deps`
        globals: {
          vue: 'Vue',
          'vue-router': 'VueRouter',
          'ant-design-vue': 'antd',
          'vue-types': 'vueTypes',
        },
      },
      plugins: [
        typescript({
          tsconfig: './tsconfig.esm.json',
          emitDeclarationOnly: true,
          target: 'es2020',
          // outDir: 'dist',
          // declaration: true,
          // declarationDir: '.',
          // exclude: 'node_modules/**',
          // allowSyntheticDefaultImports: true,
        }),
      ],
    },
  },
});
