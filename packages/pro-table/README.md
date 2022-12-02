<h1 align="center">
Ant Design Pro Table
</h1>

<div align="center">

[![NPM version](https://img.shields.io/npm/v/@ant-design-vue/pro-table/latest?style=flat)](https://npmjs.org/package/@ant-design-vue/pro-table) [![Vue Support](https://img.shields.io/badge/support-Vue3-green?style=flat)](./package.json) [![Vue Grammar Level](https://img.shields.io/badge/full-Composition%20API-blue?style=flat)](https://v3.vuejs.org/guide/composition-api-introduction.html) [![NPM downloads](http://img.shields.io/npm/dm/@ant-design-vue/pro-table.svg?style=flat)](https://npmjs.org/package/@ant-design-vue/pro-table) [![License](https://img.shields.io/github/license/vueComponent/pro-layout)](./LICENSE)

</div>

## Basic Usage

Recommend look [Examples](./examples/) or [Use Template](https://github.com/sendya/preview-pro)

## Branch

-   next : Vue3 + ant-design-vue@3.x (latest)
-   v3.1 : Vue3 + ant-design-vue@2.2.x (release LTS)
-   v2 : Vue2 + ant-design-vue@1.7.x

## Install

```bash
# yarn
yarn add @ant-design-vue/pro-table
# npm
npm i @ant-design-vue/pro-table -S
```

### Simple Usage

First, you should add the `@ant-design-vue/pro-table` that you need into the library.

```js
// main.[js|ts]
import '@ant-design-vue/pro-table/dist/style.css'; // pro-layout css or style.less

import { createApp } from 'vue';
import App from './App.vue';
import Antd from 'ant-design-vue';
import ProTable from '@ant-design-vue/pro-table';

const app = createApp(App);

app.use(Antd).use(ProLayout).use(PageContainer).mount('#app');
```

After that, you can use pro-layout in your Vue components as simply as this:

```vue
<template>
    <pro-table
        :request="request"
        :columns="columns"
        :bordered="true"
        :pagination="pagination"
    ></pro-table>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';

import type { ColumnsType } from '@ant-design-vue/pro-table';
const pagination = reactive({
    pageSize: 10
});
const columns = reactive<ColumnsType>([
    {
        dataIndex: 'name',
        title: '姓名',
        key: 'name',
        search: true
    },
    {
        dataIndex: 'age',
        title: '年龄',
        key: 'age',
        search: true
    },
    {
        dataIndex: 'action',
        title: '操作',
        key: 'action'
    }
]);
const request = async (params: any = {}) => {
    let data: any[] = [];

    console.log('params', params);
    for (let i = 0; i < params.pageSize; i++) {
        data.push({
            name: '第' + params.current + '页的' + +(i + 1) + (params?.name || ''),
            age: 18
        });
    }
    return {
        data,
        success: true,
        total: 100
    };
};
</script>
```

## API

### ProTable

| Property   | Description                                    | Type                                                  | Default Valuere |
| ---------- | ---------------------------------------------- | ----------------------------------------------------- | --------------- |
| request    | 获取`dataSource` 的方法                        | (params?: {pageSize,current}) => {data,success,total} | -               |
| dataSource | Table 的数据，protable 推荐使用 request 来加载 | T[]                                                   | -               |
|            | Vue-router`routes` prop                        | Object                                                | `[{}]`          |

### Columns 列定义

与 ant-design-vue 中 table 相比 ，多出以下属性

| Property | Description  | Type    | Default Valuere |
| -------- | ------------ | ------- | --------------- |
| search   | 是否支持搜索 | boolean | -               |

## Build project

```bash
pnpm build # Build library and .d.ts
```
