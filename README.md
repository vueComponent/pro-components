<h1 align="center">
Ant Design Pro Layout
</h1>

<div align="center">

[![NPM version](https://img.shields.io/npm/v/@ant-design-vue/pro-layout/next?style=flat)](https://npmjs.org/package/@ant-design-vue/pro-layout)
[![Vue Support](https://img.shields.io/badge/support-Vue3-green?style=flat)](./package.json)
[![Vue Grammar Level](https://img.shields.io/badge/full-Composition%20API-blue?style=flat)](https://v3.vuejs.org/guide/composition-api-introduction.html)
[![NPM downloads](http://img.shields.io/npm/dm/@ant-design-vue/pro-layout.svg?style=flat)](https://npmjs.org/package/@ant-design-vue/pro-layout)
[![License](https://img.shields.io/github/license/vueComponent/pro-layout)](./LICENSE)

</div>

## Install

```bash
# yarn
yarn add @ant-design-vue/pro-layout@next
# npm
npm i @ant-design-vue/pro-layout@next -S
```

## Basic Usage

First, you should add the icons that you need into the library.

```js
import { createApp } from 'vue'
import ProLayout, { PageContainer } from '@ant-design-vue/pro-layout';

const app = createApp();

app.use(ProLayout)
    .use(PageContainer)
    .mount('#app')
```

After that, you can use pro-layout in your Vue components as simply as this:

```vue
<template>
  <route-context-provider :value="state">
    <pro-layout>
      <router-view />
    </pro-layout>
  </route-context-provider>
</template>

<script>
import { defineComponent, reactive } from 'vue';
import { createRouteContext } from '@ant-design-vue/pro-layout';

const [ RouteContextProvider ] = createRouteContext();

export default defineComponent({
  setup() {
    const state = reactive({
      collapsed: false,

      openKeys: ['/dashboard'],
      selectedKeys: ['/welcome'],

      isMobile: false,
      fixSiderbar: false,
      fixedHeader: false,
      menuData: [],
      sideWidth: 208,
      hasSideMenu: true,
      hasHeader: true,
      hasFooterToolbar: false,
      setHasFooterToolbar: (has) => (state.hasFooterToolbar = has),
    });
    
    return {
      state,
    }
  },
  components: {
    RouteContextProvider,
  }
});
</script>
```
or `TSX`
```tsx
import { defineComponent, reactive } from 'vue';
import ProLayout, { createRouteContext, RouteContextProps } from '@ant-design-vue/pro-layout';

export default defineComponent({
    setup () {
      const [ RouteContextProvider ] = createRouteContext();
      
      const state = reactive<RouteContextProps>({
        collapsed: false,

        openKeys: ['/dashboard'],
        selectedKeys: ['/welcome'],

        isMobile: false,
        fixSiderbar: false,
        fixedHeader: false,
        menuData: [],
        sideWidth: 208,
        hasSideMenu: true,
        hasHeader: true,
        hasFooterToolbar: false,
        setHasFooterToolbar: (has: boolean) => (state.hasFooterToolbar = has),
      });
      
      return () => (
        <RouteContextProvider value={state}>
          <ProLayout>
            <RouterView />
          </ProLayout>
        </RouteContextProvider>
      )
    }
})
```


## Build project

```bash
npm run compile # Build library
npm run test # Runing Test
```
