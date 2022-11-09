<h1 align="center">
Ant Design Pro Form
</h1>

<div align="center">

[![NPM version](https://img.shields.io/npm/v/@ant-design-vue/pro-layout/latest?style=flat)](https://npmjs.org/package/@ant-design-vue/pro-layout) [![Vue Support](https://img.shields.io/badge/support-Vue3-green?style=flat)](./package.json) [![Vue Grammar Level](https://img.shields.io/badge/full-Composition%20API-blue?style=flat)](https://v3.vuejs.org/guide/composition-api-introduction.html) [![NPM downloads](http://img.shields.io/npm/dm/@ant-design-vue/pro-layout.svg?style=flat)](https://npmjs.org/package/@ant-design-vue/pro-layout) [![License](https://img.shields.io/github/license/vueComponent/pro-layout)](./LICENSE)

</div>
## Basic Usage

Recommend look [Examples](./examples/)

## Branch

- next : Vue3 + ant-design-vue@3.x (latest)
- v3.1 : Vue3 + ant-design-vue@2.2.x (release LTS)
- v2 : Vue2 + ant-design-vue@1.7.x

## Install

```bash
# yarn
yarn add @ant-design-vue/pro-form
# npm
npm i @ant-design-vue/pro-form -S
```

### Simple Usage

```js
// main.[js|ts]
import "@ant-design-vue/pro-form/dist/style.css"; // pro-form css or style.less
```

```vue
<template>
  <QueryFilter
    :model="formModel"
    @finish="handleSubmit"
    @collapsed="onCollapsed"
  >
    <FormItem name="name" label="应用名称" required>
      <Input v-model:value="formModel.name" placeholder="请输入" allow-clear />
    </FormItem>
    <FormItem name="creater" label="创建人" required>
      <Input v-model:value="formModel.creater" placeholder="请输入" />
    </FormItem>
    <FormItem name="sex" label="性别" required>
      <Select v-model:value="formModel.sex">
        <SelectOption
          v-for="item in sex"
          :key="item.value"
          :value="item.value"
          >{{ item.label }}</SelectOption
        >
      </Select>
    </FormItem>
    <FormItem name="status" label="应用状态">
      <Input v-model:value="formModel.status" placeholder="请输入" />
    </FormItem>
    <FormItem name="startDate" label="响应日期">
      <DatePicker v-model:value="formModel.startDate" placeholder="请输入" />
    </FormItem>
    <FormItem name="create" label="创建时间">
      <RangePicker
        v-model:value="formModel.create"
        :placeholder="['开始时间', '结束时间']"
      />
    </FormItem>
  </QueryFilter>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import { QueryFilter } from "@ant-design-vue/pro-form";
import dayjs, { type Dayjs } from "dayjs";
import {
  FormItem,
  Input,
  Select,
  SelectOption,
  RangePicker,
  DatePicker,
} from "ant-design-vue";

const formModel = reactive({
  name: "123",
  creater: "11",
  sex: "男",
  status: "",
  startDate: "",
  create: [
    dayjs("2015/01/01", "YYYY/MM/DD"),
    dayjs("2016/01/01", "YYYY/MM/DD"),
  ] as [Dayjs, Dayjs],
});
const sex = ref([
  {
    value: "男",
    label: "男",
  },
  {
    value: "女",
    label: "女",
  },
]);

function handleSubmit(params: any) {
  console.log(params);
}
function onCollapsed(collapsed: boolean) {
  console.log(collapsed);
}
</script>
```

## API

### ProLayout

| Property          | Description                                                                                                  | Type                         | Default Value |
| ----------------- | ------------------------------------------------------------------------------------------------------------ | ---------------------------- | ------------- |
| formProps         | antd 基础表单 props                                                                                          | object                       |               |
| searchGutter      | 表单 gutter                                                                                                  | number                       | 24            |
| style             | 自定义样式                                                                                                   | object                       | undefined     |
| defaultColsNumber | 自定义折叠状态下默认显示的表单控件数量，没有设置或小于 0，则显示一行控件; 数量大于等于控件数量则隐藏展开按钮 | Number                       | undefined     |
| collapsed         | 是否折叠超出的表单项，用于受控模式                                                                           | Boolean                      | undefined     |
| defaultCollapsed  | 默认状态下是否折叠超出的表单项                                                                               | Boolean                      | true          |
| preserve          | 是否能够查询收起的数据，如果设置为 false，收起后的表单数据将会丢失                                           | Boolean                      | true          |
| split             | 每一行是否有分割线                                                                                           | Boolean                      | undefined     |
| submitButtonProps | 提交按钮的 props                                                                                             | Object                       | undefined     |
| submitter         | 重置、查询、展开收起按钮 props                                                                               | SubmitterProps               | undefined     |
| onCollapsed       | 切换表单折叠状态时的回调                                                                                     | (collapsed: boolean) => void | undefined     |
| onFinish          | 表单提交                                                                                                     | (fromModel: any) => void     | undefined     |
| onSubmit          | 表单提交                                                                                                     | (fromModel: any) => void     | undefined     |
| onReset           | 重置表单                                                                                                     | (fromModel: any) => void     | undefined     |

## Build project

```bash
pnpm build # Build library and .d.ts
```

## TODO:

- [x] BaseFrom
- [x] QueryFilter
- [ ] ProForm
  - [ ] ProField
  - [ ] 更多原子组件...
- [ ] LoginFrom
- [ ] ModalFrom
- [ ] DrawerFrom
- [ ] ProTable
- [ ] 一个像样的文档(VitePress)
