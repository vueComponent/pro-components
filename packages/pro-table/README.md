<h1 align="center">
Ant Design Pro Table
</h1>

<div align="center">

[![NPM version](https://img.shields.io/npm/v/@ant-design-vue/pro-table/latest?style=flat)](https://npmjs.org/package/@ant-design-vue/pro-table) [![Vue Support](https://img.shields.io/badge/support-Vue3-green?style=flat)](./package.json) [![Vue Grammar Level](https://img.shields.io/badge/full-Composition%20API-blue?style=flat)](https://v3.vuejs.org/guide/composition-api-introduction.html) [![NPM downloads](http://img.shields.io/npm/dm/@ant-design-vue/pro-table.svg?style=flat)](https://npmjs.org/package/@ant-design-vue/pro-table) [![License](https://img.shields.io/github/license/vueComponent/pro-components)](./LICENSE)

</div>

# ProTable - Advanced Tables

ProTable was created to solve the problem of having to write a lot of sample code for tables in a project, so a lot of common logic was encapsulated in it. These wrappers can be simply categorized as pre-defined behaviors and pre-defined logic.

Thanks to ProForm's capabilities, ProForm can take many forms, switch between query form types, set up deformations to become a simple Form form, perform new creation, etc.

![layout
](https://gw.alipayobjects.com/zos/antfincdn/Hw%26ryTueTW/bianzu%2525204.png)

## When to Use

When your forms need to interact with the server or need multiple cell styles, ProTable is the right choice.

## API

ProTable puts a layer of wrapping on top of antd's Table, supports some presets, and encapsulates some behaviors. Only api's that differ from antd Table are listed here.

### request

`request` is the most important API of ProTable, `request` takes an object. The object must have `data` and `success` in it, and `total` is also required if manual paging is needed. `request` takes over the `loading` settings and re-executes them when the query form is queried and the `params` parameters are modified. Also the query form values and `params` parameters are brought in. The following is an example.

```tsx | pure
<ProTable
  // params is a parameter that needs to be self-contained
  // This parameter has higher priority and will override the parameters of the query form
  params={params}
  request={async (
    // The first parameter params is the combination of the query form and params parameters
    // The first parameter will always have pageSize and current, which are antd specifications
    params: T & {
      pageSize: number;
      current: number;
    },
    sort,
    filter,
  ) => {
    // Here you need to return a Promise, and you can transform the data before returning it
    // If you need to transform the parameters you can change them here
    const payload = await axios.get('//api', {
      page: params.current,
      pageSize: params.pageSize,
    });
    return {
      data: payload.result,
      // Please return true for success.
      // otherwise the table will stop parsing the data, even if there is data
      success: boolean,
      // not passed will use the length of the data, if it is paged you must pass
      total: number,
    };
  }}
/>
```

### Attributes

| Name | Description | Type | Default Value |
| --- | --- | --- | --- |
| request | How to get `dataSource` | `(params?: {pageSize,current},sort,filter) => {data,success,total}` | - |
| params | Additional parameters used for `request` query, once changed will trigger reloading | `object` | - |
| cardBordered | Border of Card components around Table and Search | `boolean \| {search?: boolean, table?: boolean}` | false |
| cardProps | Card's props which wrap the Table, not displayed when set to false | `false` \| [CardProps](https://antdv.com/components/card#API) | - |
| toolbar | Transparent transmission of `ListToolBar` configuration items, not displayed when set to false | `false` \| [ListToolBarProps](#listtoolbarprops) |  |
| options | table toolbar, not displayed when set to false | `{{ reload: boolean \| function, density?: boolean, setting: boolean, fullScreen: boolean \| function }}` | `{ reload :true, density: true, setting: true }` |

### Slots

| Name     | Description                                              | Tag             |
| -------- | -------------------------------------------------------- | --------------- |
| actions  | Render toolbar actions area                              | v-slot:actions  |
| settings | Render toolbar settings area, will overwrite the options | v-slot:settings |

### Events

| Name         | Description                                                             | Arguments                   |
| ------------ | ----------------------------------------------------------------------- | --------------------------- |
| load         | Triggered after the data is loaded, it will be triggered multiple times | `(dataSource: T[]) => void` |
| requestError | Triggered when data loading fails                                       | `(error: Error) => void`    |

### ListToolbar

Toolbar section for customizing forms.

#### ListToolBarProps

Toolbar configuration properties for lists and tables

| Parameters   | Description                                              | Type                            | Default |
| ------------ | -------------------------------------------------------- | ------------------------------- | ------- |
| title        | title                                                    | `not implemented`               | -       |
| subTitle     | subTitle                                                 | `not implemented`               | -       |
| description  | description                                              | `not implemented`               | -       |
| search       | query area                                               | `not implemented`               | -       |
| actions      | actions area                                             | `false \| VNode[]`              | -       |
| settings     | settings area                                            | `false \| (VNode \| Setting)[]` | -       |
| filter       | The filter area, usually used with `LightFilter`         | `not implemented`               | -       |
| multipleLine | Whether to display multiple lines                        | `not implemented`               | -       |
| menu         | menu configuration                                       | `not implemented`               | -       |
| tabs         | Tabs configuration, only valid if `multipleLine` is true | `not implemented`               | -       |

#### Setting

| Parameters | Description                 | Type                  | Default |
| ---------- | --------------------------- | --------------------- | ------- |
| icon       | icon                        | `ReactNode`           | -       |
| tooltip    | tooltip Description         | `string`              | -       |
| key        | operation unique identifier | `string`              | -       |
| onClick    | set to be triggered         | `(key: string)=>void` | -       |
