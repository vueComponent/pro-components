<h1 align="center">
Ant Design Pro Layout
</h1>

<div align="center">

[![NPM version](https://img.shields.io/npm/v/@ant-design-vue/pro-layout.svg?style=flat)](https://npmjs.org/package/@ant-design-vue/pro-layout)
[![NPM downloads](http://img.shields.io/npm/dm/@ant-design-vue/pro-layout.svg?style=flat)](https://npmjs.org/package/@ant-design-vue/pro-layout)

</div>

## Install

```bash
# yarn
yarn add @ant-design-vue/pro-layout
# npm
npm i @ant-design-vue/pro-layout -S
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
    <pro-layout>
        <router-view />
    </pro-layout>
</template>
```
or `TSX`
```jsx
import ProLayout from '@ant-design-vue/pro-layout'

export default defineComponent({
    setup () {
        return (): JSX.Element => (
            <ProLayout>
                <RouterView />
            </ProLayout>
        )
    }
})
```


## Build project

```bash
npm run generate # Generate files to ./src
npm run compile # Build library
npm run test # Runing Test
```
