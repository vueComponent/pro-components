<h1 align="center">
Ant Design Pro Layout
</h1>

<div align="center">

[![NPM version](https://img.shields.io/npm/v/@ant-design-vue/pro-layout/latest?style=flat)](https://npmjs.org/package/@ant-design-vue/pro-layout) [![Vue Support](https://img.shields.io/badge/support-Vue3-green?style=flat)](./package.json) [![Vue Grammar Level](https://img.shields.io/badge/full-Composition%20API-blue?style=flat)](https://v3.vuejs.org/guide/composition-api-introduction.html) [![NPM downloads](http://img.shields.io/npm/dm/@ant-design-vue/pro-layout.svg?style=flat)](https://npmjs.org/package/@ant-design-vue/pro-layout) [![License](https://img.shields.io/github/license/vueComponent/pro-layout)](./LICENSE)

</div>

<details>
   <summary> 💻 <b>Preview layout</b>: </summary>
   <br />
   <img src="https://user-images.githubusercontent.com/5404542/130903472-5020f0ff-a1c3-461a-9072-134b5fdd4c0e.jpeg" />
   <img src="https://user-images.githubusercontent.com/5404542/130903580-def38691-e912-4a05-aa50-8ab112acf9f4.jpeg" />
   <img src="https://user-images.githubusercontent.com/5404542/130903670-558423f1-987a-446e-ad56-1d7791e9ad5f.jpeg" />
   <img src="https://user-images.githubusercontent.com/5404542/130903737-f8a6a404-8445-43fd-830b-d72974edc3ff.jpeg" />
</details>

## Basic Usage

Recommend look [Examples](./examples/) or [Use Template](https://github.com/sendya/preview-pro)

## Branch

- next : Vue3 + ant-design-vue@3.x (latest)
- v3.1 : Vue3 + ant-design-vue@2.2.x (release LTS)
- v2 : Vue2 + ant-design-vue@1.7.x

## Install

```bash
# yarn
yarn add @ant-design-vue/pro-layout
# npm
npm i @ant-design-vue/pro-layout -S
```

### Simple Usage

First, you should add the `@ant-design-vue/pro-layout` that you need into the library.

```js
// main.[js|ts]
import "@ant-design-vue/pro-layout/dist/style.css"; // pro-layout css or style.less

import { createApp } from "vue";
import App from "./App.vue";
import Antd from "ant-design-vue";
import ProLayout, { PageContainer } from "@ant-design-vue/pro-layout";

const app = createApp(App);

app.use(Antd).use(ProLayout).use(PageContainer).mount("#app");
```

After that, you can use pro-layout in your Vue components as simply as this:

```vue
<template>
  <pro-layout
    :locale="locale"
    v-bind="layoutConf"
    v-model:openKeys="state.openKeys"
    v-model:collapsed="state.collapsed"
    v-model:selectedKeys="state.selectedKeys"
  >
    <router-view />
  </pro-layout>
</template>

<script setup lang="ts">
import { reactive, useRouter } from "vue";
import { getMenuData, clearMenuItem } from "@ant-design-vue/pro-layout";

const locale = (i18n: string) => i18n;
const router = useRouter();

const { menuData } = getMenuData(clearMenuItem(router.getRoutes()));

const state = reactive({
  collapsed: false, // default value
  openKeys: ["/dashboard"],
  selectedKeys: ["/welcome"],
});
const layoutConf = reactive({
  navTheme: "dark",
  layout: "mix",
  splitMenus: false,
  menuData,
});
</script>
```

## API

### ProLayout

| Property                | Description                                                           | Type                                                                   | Default Value      |
| ----------------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------------- | ------------------ |
| title                   | layout in the upper left corner title                                 | VNode \| String                                                        | `'Ant Design Pro'` |
| logo                    | layout top left logo url                                              | VNode \| render                                                        | -                  |
| loading                 | layout loading status                                                 | boolean                                                                | -                  |
| layout                  | layout menu mode, sidemenu: right navigation, topmenu: top navigation | 'side' \| 'top' \| 'mix'                                               | `'side'`           |
| contentWidth            | content mode of layout, Fluid: adaptive, Fixed: fixed width 1200px    | 'Fixed' \| 'Fluid'                                                     | `Fluid`            |
| navTheme                | Navigation theme                                                      | 'light' \|'dark'                                                       | `'light'`          |
| headerTheme             | Header Bar theme                                                      | 'light' \|'dark'                                                       | `'light'`          |
| menuData                | Vue-router `routes` prop                                              | Object                                                                 | `[{}]`             |
| collapsed               | control menu's collapse and expansion                                 | boolean                                                                | true               |
| selectedKeys            | menu selected keys                                                    | string[]                                                               | `[]`               |
| openKeys                | menu openKeys                                                         | string[]                                                               | `[]`               |
| isMobile                | is mobile                                                             | boolean                                                                | false              |
| onCollapse \| @collapse | folding collapse event of menu                                        | (collapsed: boolean) => void                                           | -                  |
| menuHeaderRender        | render header logo and title                                          | v-slot \| VNode \| (logo,title)=>VNode \| false                        | -                  |
| menuExtraRender         | render extra menu item                                                | v-slot \| VNode \| (props)=>VNode \| false                             | -                  |
| menuFooterRender        | render footer menu item                                               | v-slot \| VNode \| (props)=>VNode \| false                             | -                  |
| menuItemRender          | custom render Menu.Item                                               | v-slot#menuItemRender="{ item, icon }" \| ({ item, icon }) => VNode    | null               |
| subMenuItemRender       | custom render Menu.SubItem                                            | v-slot#subMenuItemRender="{ item, icon }" \| ({ item, icon }) => VNode | null               |
| collapsedButtonRender   | custom collapsed button method                                        | `slot` \| (collapsed: boolean) => VNode                                | -                  |
| headerRender            | custom header render method                                           | `slot` \| (props: BasicLayoutProps) => VNode                           | -                  |
| headerContentRender     | header content render method only layout side                         | `slot` \| (props: BasicLayoutProps) => VNode                           | -                  |
| rightContentRender      | header right content render method                                    | `slot` \| (props: BasicLayoutProps) => VNode                           | -                  |
| footerRender            | custom footer render method                                           | `slot` \| (props: BasicLayoutProps) => VNode                           | `false`            |
| tabRender               | custom tab render method                                              | `slot` \| ({ width, ...BasicLayoutProps }) => VNode                    | `false`            |
| breadcrumbRender        | custom breadcrumb render method                                       | `slot` \| ({ route, params, routes, paths, h }) => VNode[]             | -                  |
| locale                  | i18n                                                                  | Function (key: string) => string \| `false`                            | `false`            |

> Menu generation requires `getMenuData` and `clearMenuItem` function
> e.g. `const { menuData } = getMenuData(clearMenuItem(routes))`

### PageContainer

| Property       | Description                                      | Type                               | Default Value |
| -------------- | ------------------------------------------------ | ---------------------------------- | ------------- |
| content        | Content area                                     | VNode \| v-slot                    | -             |
| extra          | Extra content area, on the right side of content | VNode \| v-slot                    | -             |
| extraContent   | Extra content area, on the right side of content | VNode \| v-slot                    | -             |
| tabList        | Tabs title list                                  | `Array<{key: string, tab: sting}>` | -             |
| tab-change     | Switch panel callback                            | (key) => void                      | -             |
| tab-active-key | The currently highlighted tab item               | string                             | -             |
| breadcrumb     | Show Bread crumbs bar                            | Boolean                            | -             |

### WaterMark

| Property      | Description                           | Type             | Default Value          |
| ------------- | ------------------------------------- | ---------------- | ---------------------- |
| markStyle     | mark style                            | CSSProperties    | -                      |
| markClassName | mark class                            | string           | -                      |
| gapX          | Horizontal spacing between water-mark | number           | 212                    |
| gapY          | Vertical spacing between watermark    | number           | 222                    |
| offsetLeft    | Horizontal offset                     | number           | `offsetTop = gapX / 2` |
| offsetTop     | Vertical offset                       | number           | `offsetTop = gapY / 2` |
|               |                                       |                  |                        |
| width         |                                       | number           | 120                    |
| height        |                                       | number           | 64                     |
| rotate        | Angle of rotation, unit °             | number           | -22                    |
| image         | image src                             | string           | -                      |
| zIndex        | water-mark z-index                    | number           | 9                      |
| content       | water-mark Content                    | string           | -                      |
| fontColor     | font-color                            | string           | `rgba(0,0,0,.15)`      |
| fontSize      | font-size                             | string`\|`number | 16                     |

### Custom Render

#### Custom rightContentRender

```vue
<template #rightContentRender>
  <div style="margin-right: 12px">
    <a-avatar shape="square" size="small">
      <template #icon>
        <UserOutlined />
      </template>
    </a-avatar>
  </div>
</template>
```

#### Custom menu.item

```vue
<template #menuItemRender="{ item, icon }">
  <a-menu-item
    :key="item.path"
    :disabled="item.meta?.disabled"
    :danger="item.meta?.danger"
    :icon="icon"
  >
    <router-link :to="{ path: item.path }">
      <span class="ant-pro-menu-item">
        <a-badge count="5" dot>
          <span class="ant-pro-menu-item-title">{{ item.meta.title }}</span>
        </a-badge>
      </span>
    </router-link>
  </a-menu-item>
</template>
```

#### Custom menuExtraRender

```vue
<template #menuExtraRender="{ collapsed }">
  <a-input-search v-if="!collapsed" />
</template>
```

#### Custom menuFooterRender

```vue
<template #menuFooterRender>
  <div>menu footer</div>
</template>
```

#### Custom breadcrumbRender

```vue
<template #breadcrumbRender="{ route, params, routes }">
  <span v-if="routes.indexOf(route) === routes.length - 1">
    {{ route.breadcrumbName }}
  </span>
  <router-link v-else :to="{ path: route.path, params }">
    {{ route.breadcrumbName }}
  </router-link>
</template>
```

#### Custom collapsedButtonRender

```vue
<template #collapsedButtonRender="collapsed">
  <HeartOutlined v-if="collapsed" />
  <SmileOutlined v-else />
</template>
```

#### Custom tabRender

```vue
<template #tabRender="{ width, fixedHeader }">
  <div>
    <header
      class="ant-layout-header"
      style="height: 36px; line-height: 36px; background: transparent"
      v-if="fixedHeader"
    ></header>
    <div
      :style="{
        margin: '0',
        height: '36px',
        lineHeight: '36px',
        right: '0px',
        top: '48px',
        position: fixedHeader ? 'fixed' : 'unset',
        zIndex: 14,
        padding: '4px 16px',
        width: width,
        background: '#fff',
        boxShadow: '0 1px 4px #0015291f',
        transition: 'background 0.3s, width 0.2s',
      }"
    >
      tabRender fixedHeader：{{fixedHeader}} width：{{ width }} 
    </div>
  </div>
</template>
```

#### Custom footer with slot

```vue
<GlobalFooter>
  <template #links>
    <a>链接1</a>
    <a>链接2</a>
    <a>链接3</a>
    <a>链接4</a>
  </template>
  <template #copyright>
    <span>Pro Layout &copy; 2021 Sendya.</span>
  </template>
</GlobalFooter>
```

#### Custom footer with props

```vue
<GlobalFooter
  :links="[
    { title: 'Link 1', href: '#' },
    { title: 'Link 2', href: '#' },
  ]"
  copyright="Pro Layout &copy; 2021 Sendya."
/>
```

### Use WaterMark

```vue
<router-view v-slot="{ Component }">
  <WaterMark content="Pro Layout">
    <component :is="Component" />
  </WaterMark>
</router-view>
```

## Build project

```bash
pnpm build # Build library and .d.ts
```
