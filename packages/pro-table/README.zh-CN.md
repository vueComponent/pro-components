<h1 align="center">
Ant Design Pro Table
</h1>

<div align="center">

[![NPM version](https://img.shields.io/npm/v/@ant-design-vue/pro-table/latest?style=flat)](https://npmjs.org/package/@ant-design-vue/pro-table) [![Vue Support](https://img.shields.io/badge/support-Vue3-green?style=flat)](./package.json) [![Vue Grammar Level](https://img.shields.io/badge/full-Composition%20API-blue?style=flat)](https://v3.vuejs.org/guide/composition-api-introduction.html) [![NPM downloads](http://img.shields.io/npm/dm/@ant-design-vue/pro-table.svg?style=flat)](https://npmjs.org/package/@ant-design-vue/pro-table) [![License](https://img.shields.io/github/license/vueComponent/pro-components)](./LICENSE)

</div>

# ProTable - 高级表格

ProTable 的诞生是为了解决项目中需要写很多 table 的样板代码的问题，所以在其中做了封装了很多常用的逻辑。这些封装可以简单的分类为预设行为与预设逻辑。

依托于 ProForm 的能力，ProForm 拥有多种形态，可以切换查询表单类型，设置变形成为一个简单的 Form 表单，执行新建等功能。

![layout
](https://gw.alipayobjects.com/zos/antfincdn/Hw%26ryTueTW/bianzu%2525204.png)

## 何时使用

当你的表格需要与服务端进行交互或者需要多种单元格样式时，ProTable 是不二选择。

## API

ProTable 在 antd 的 Table 上进行了一层封装，支持了一些预设，并且封装了一些行为。这里只列出与 ant-design-vue Table 不同的 api。

### request

`request` 是 ProTable 最重要的 API，`request` 会接收一个对象。对象中必须要有 `data` 和 `success`，如果需要手动分页 `total` 也是必需的。`request` 会接管 `loading` 的设置，同时在查询表单查询和 `params` 参数发生修改时重新执行。同时 查询表单的值和 `params` 参数也会带入。以下是一个例子：

```tsx | pure
<ProTable
  // params 是需要自带的参数
  // 这个参数优先级更高，会覆盖查询表单的参数
  params={params}
  request={async (
    // 第一个参数 params 查询表单和 params 参数的结合
    // 第一个参数中一定会有 pageSize 和  current ，这两个参数是 antd 的规范
    params: T & {
      pageSize: number;
      current: number;
    },
    sort,
    filter,
  ) => {
    // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
    // 如果需要转化参数可以在这里进行修改
    const payload = await axios.get('//api', {
      page: params.current,
      pageSize: params.pageSize,
    });
    return {
      data: payload.result,
      // success 请返回 true，
      // 不然 table 会停止解析数据，即使有数据
      success: boolean,
      // 不传会使用 data 的长度，如果是分页一定要传
      total: number,
    };
  }}
/>
```

### 属性

| 名称 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| request | 获取 `dataSource` 的方法 | `(params?: {pageSize,current},sort,filter) => {data,success,total}` | - |
| params | 用于 `request` 查询的额外参数，一旦变化会触发重新加载 | `object` | - |
| cardBordered | Table 和 Search 外围 Card 组件的边框 | `boolean \| {search?: boolean, table?: boolean}` | false |
| cardProps | Table 外围的 Card 组件的属性，设为 false 时不显示 | false |  |
| toolbar | 透传 `ListToolBar` 配置项 | [ListToolBarProps](#listtoolbarprops) | - |
| options | table 工具栏设置区域的配置项，传入 function 会点击时触发 | `{{ density?: boolean, fullScreen: boolean \| function, reload: boolean \| function, setting: boolean `}}` | `{ fullScreen: false, reload: true, setting: true }` |

### 插槽

| 名称     | 说明                 | 标签            |
| -------- | -------------------- | --------------- |
| actions  | table 工具栏操作区域 | v-slot:actions  |
| settings | table 工具栏设置区域 | v-slot:settings |

### 事件

| 名称         | 说明                          | 参数                        |
| ------------ | ----------------------------- | --------------------------- |
| load         | 数据加载完成后触发,会多次触发 | `(dataSource: T[]) => void` |
| requestError | 数据加载失败时触发            | `(error: Error) => void`    |

### 列表工具栏

用于自定义表格的工具栏部分。

#### ListToolBarProps

| 参数         | 说明                                           | 类型                              | 默认值  |
| ------------ | ---------------------------------------------- | --------------------------------- | ------- |
| title        | 标题                                           | `尚未实现`                        | -       |
| subTitle     | 子标题                                         | `尚未实现`                        | -       |
| description  | 描述                                           | `尚未实现`                        | -       |
| search       | 查询区                                         | `尚未实现`                        | -       |
| actions      | 操作区                                         | `false \| VueNode[]`              | -       |
| settings     | 设置区                                         | `false \| (VueNode \| Setting)[]` | -       |
| filter       | 过滤区，通常配合 `LightFilter` 使用            | `尚未实现`                        | -       |
| multipleLine | 是否多行展示                                   | `尚未实现`                        | `false` |
| menu         | 菜单配置                                       | `尚未实现`                        | -       |
| tabs         | 标签页配置，仅当 `multipleLine` 为 true 时有效 | `尚未实现`                        | -       |

#### Setting

| 参数    | 说明         | 类型                  | 默认值 |
| ------- | ------------ | --------------------- | ------ |
| icon    | 图标         | `ReactNode`           | -      |
| tooltip | tooltip 描述 | `string`              | -      |
| key     | 操作唯一标识 | `string`              | -      |
| onClick | 设置被触发   | `(key: string)=>void` | -      |
