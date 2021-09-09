<h1 align="center">
Ant Design Pro Layout
</h1>

<div align="center">

[![NPM version](https://img.shields.io/npm/v/@ant-design-vue/pro-layout/next?style=flat)](https://npmjs.org/package/@ant-design-vue/pro-layout) [![Vue Support](https://img.shields.io/badge/support-Vue3-green?style=flat)](./package.json) [![Vue Grammar Level](https://img.shields.io/badge/full-Composition%20API-blue?style=flat)](https://v3.vuejs.org/guide/composition-api-introduction.html) [![NPM downloads](http://img.shields.io/npm/dm/@ant-design-vue/pro-layout.svg?style=flat)](https://npmjs.org/package/@ant-design-vue/pro-layout) [![License](https://img.shields.io/github/license/vueComponent/pro-layout)](./LICENSE)

</div>

## Install

```bash
# yarn
yarn add @ant-design-vue/pro-layout@next
# npm
npm i @ant-design-vue/pro-layout@next -S
```

<details>
   <summary> 💻 <b>Preview layout</b>: </summary>
   <br />
   <img src="https://user-images.githubusercontent.com/5404542/130903472-5020f0ff-a1c3-461a-9072-134b5fdd4c0e.jpeg" />
   <img src="https://user-images.githubusercontent.com/5404542/130903580-def38691-e912-4a05-aa50-8ab112acf9f4.jpeg" />
   <img src="https://user-images.githubusercontent.com/5404542/130903670-558423f1-987a-446e-ad56-1d7791e9ad5f.jpeg" />
   <img src="https://user-images.githubusercontent.com/5404542/130903737-f8a6a404-8445-43fd-830b-d72974edc3ff.jpeg" />
</details>

## Basic Usage

look [Examples](./examples/) | Use Template https://github.com/sendya/preview-pro



First, you should add the `@ant-design-vue/pro-layout` that you need into the library.

```js
import 'ant-design-vue/dist/antd.less'; // antd css
import '@ant-design-vue/pro-layout/dist/style.css'; // pro-layout css or style.less

import { createApp } from 'vue';
import ProLayout, { PageContainer } from '@ant-design-vue/pro-layout';

const app = createApp();

app.use(ProLayout).use(PageContainer).mount('#app');
```

After that, you can use pro-layout in your Vue components as simply as this:

```vue
<template>
  <pro-layout
    :locale="locale"
    v-bind="state"
    v-model:openKeys="base.openKeys"
    v-model:collapsed="base.collapsed"
    v-model:selectedKeys="base.selectedKeys"
  >
    <router-view />
  </pro-layout>
</template>

<script>
import { defineComponent, reactive } from 'vue';
import { getMenuData, clearMenuItem } from '@ant-design-vue/pro-layout';

const locale = (i18n: string) => i18n;

export default defineComponent({
  setup() {
    const router = useRouter();
    const { menuData } = getMenuData(clearMenuItem(router.getRoutes()));
    const base = reactive({
      collapsed: false, // default value
      openKeys: ['/dashboard'],
      selectedKeys: ['/welcome'],
    })
    const state = reactive({
      navTheme: 'dark',
      layout: 'mix',
      splitMenus: false,
      menuData,
    });

    return {
      locale,
      base,
      state,
    };
  },
});
</script>
```

or `TSX`

```tsx
import { defineComponent, reactive } from 'vue';
import { RouterView } from 'vue-router';
import ProLayout from '@ant-design-vue/pro-layout';
import '@ant-design-vue/pro-layout/dist/style.css'; // pro-layout css or style.less

export default defineComponent({
  setup() {
    const router = useRouter();
    const { menuData } = getMenuData(clearMenuItem(router.getRoutes()));
    const base = reactive({
      collapsed: false, // default value
      openKeys: ['/dashboard'],
      selectedKeys: ['/welcome'],
    })
    const state = reactive({
      navTheme: 'dark',
      layout: 'mix',
      splitMenus: false,
      menuData,
    });
    const handleCollapse = (collapsed: boolean) => {
      base.collapsed = collapsed;
    }
    const handleSelect = (selectedKeys: string[]) => {
      base.selectedKeys = selectedKeys;
    }
    const handleOpenKeys = (openKeys: string[]) => {
      base.openKeys = openKeys;
    }

    return () => (
      <ProLayout 
        {...state}
        {...base}
        locale={(i18n: string) => i18n}
        onCollapse={handleCollapse}
        onSelect={handleSelect}
        onOpenKeys={handleOpenKeys}
      >
        <RouterView />
      </ProLayout>
    );
  },
});
```



## API

### ProLayout

| Property | Description | Type | Default Value |
| --- | --- | --- | --- |
| title | layout in the upper left corner title | VNode \| String | `'Ant Design Pro'` |
| logo | layout top left logo url | VNode \| render | - |
| loading | layout loading status | boolean | - |
| layout | layout menu mode, sidemenu: right navigation, topmenu: top navigation | 'side' \| 'top' \| 'mix' | `'side'` |
| contentWidth | content mode of layout, Fluid: adaptive, Fixed:  fixed width 1200px | 'Fixed' \| 'Fluid' | `Fluid` |
| theme | Navigation menu theme | 'light' \| 'dark' | `'light'` |
| navTheme | Navigation Bar theme | 'light' \|'dark' | `'light'` |
| menuData | Vue-router `routes` prop | Object | `[{}]` |
| collapsed | control menu's collapse and expansion | boolean | true |
| selectedKeys | menu selected keys | string[] | `[]` |
| openKeys | menu openKeys | string[] | `[]` |
| isMobile | is mobile | boolean | false |
| handleCollapse | folding collapse event of menu | (collapsed: boolean) => void | - |
| menuHeaderRender | render header logo and title | v-slot \| VNode \| (logo,title)=>VNode \| false | - |
| menuExtraRender | render extra menu item | v-slot \| VNode \| (props)=>VNode \| false | - |
| menuFooterRender | render footer menu item | v-slot \| VNode \| (props)=>VNode \| false | - |
| headerContentRender | custom header render method | `slot` \| (props: BasicLayoutProps) => VNode | - |
| rightContentRender | header right content render method | `slot` \| (props: HeaderViewProps) => VNode | - |
| collapsedButtonRender | custom collapsed button method | `slot` \| (collapsed: boolean) => VNode | - |
| footerRender | custom footer render method | `slot` \| (props: BasicLayoutProps) => VNode | `false` |
| breadcrumbRender | custom breadcrumb render method | `slot` \| ({ route, params, routes, paths, h }) => VNode[] | - |
| menuItemRender | custom render Menu.Item | v-slot#menuItemRender="{ item, icon }" \| ({ item, icon }) => VNode | null |
| menuSubItemRender | custom render Menu.SubItem | v-slot#menuSubItemRender="{ item, icon }" \| ({ item, icon }) => VNode | null |
| locale | i18n | Function (key: string) => string \| `false` | `false` |



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


### PageContainer

| Property | Description | Type | Default Value |
| --- | --- | --- | --- |
| content | Content area | VNode \| v-slot | - |
| extra | Extra content area, on the right side of content | VNode \| v-slot | - |
| extraContent | Extra content area, on the right side of content | VNode \| v-slot | - |
| tabList | Tabs title list | `Array<{key: string, tab: sting}>` | - |
| tab-change | Switch panel callback | (key) => void | - |
| tab-active-key | The currently highlighted tab item | string | - |



## Build project

```bash
npm run build # Build library
npm run build:types # Build d.ts
```
