import { fileURLToPath, URL } from 'url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import typescript from '@rollup/plugin-typescript';
import lessCopy from '@shared/vite-plugin-less-copy';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), vueJsx(), lessCopy()],
    resolve: {
        alias: {
            '@ant-design-vue/pro-table': fileURLToPath(new URL('./src', import.meta.url)),
            '@': fileURLToPath(new URL('./examples', import.meta.url))
        }
    },
    css: {
        postcss: {},
        preprocessorOptions: {
            less: {
                // DO NOT REMOVE THIS LINE
                javascriptEnabled: true
                // modifyVars: {
                //   hack: `true; @import 'ant-design-vue/es/style/themes/default.less'`,
                // }
            }
        }
    },
    build: {
        lib: {
            entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
            name: 'ProLayout'
        },
        rollupOptions: {
            external: [
                'vue',
                'vue-router',
                '@ant-design/icons-vue',
                '@ant-design/icons-svg',
                'ant-design-vue',
                'moment',
                'vue-types'
            ],
            output: {
                exports: 'named',
                // Provide global variables to use in the UMD build
                // for externalized deps`
                globals: {
                    vue: 'Vue',
                    'vue-router': 'VueRouter',
                    'ant-design-vue': 'antd',
                    '@ant-design/icons-vue': 'iconsVue',
                    '@ant-design/icons-svg': 'iconsSvg',
                    'vue-types': 'vueTypes',
                    moment: 'moment'
                }
            },
            plugins: [
                typescript({
                    tsconfig: './tsconfig.esm.json',
                    target: 'es2020',
                    emitDeclarationOnly: true
                    // outDir: 'dist',
                    // declaration: true,
                    // declarationDir: '.',
                    // exclude: 'node_modules/**',
                    // allowSyntheticDefaultImports: true,
                })
            ]
        }
    }
});
