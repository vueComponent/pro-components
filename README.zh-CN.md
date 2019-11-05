[English](./README.md) | 简体中文

<h1 align="center">Ant Design Pro Layout</h1>

## 使用

```bash
npm i @vue-component/pro-layout --save
// or
yarn add @vue-component/pro-layout
```

```jsx
import ProLayout from '@vue-component/pro-layout'

export default {
  name: 'BasicLayout',
  render () {
    return (
      <ProLayout>
        <router-view />
      </ProLayout>
    )
  }
}
```

## API

### ProLayout

| Property | Description | Type | Default Value |
| --- | --- | --- | --- |
| title | layout in the upper left corner title | VNode \| String | `'Ant Design Pro'` |
| logo | layout top left logo url | VNode \| render | - |
| layout | layout menu mode, sidemenu: right navigation, topmenu: top navigation | 'sidemenu' \| 'topmenu' | `'sidemenu'` |
| contentWidth | content mode of layout, Fluid: fixed width 1200px, Fixed: adaptive | true \| false | `false` |
| theme | Navigation menu theme | 'light' \| 'dark' | `'dark'` |
| menus | vue-router `routes` prop | Object | `[{}]` |
| collapsed | control menu's collapse and expansion | boolean | true |
| handleCollapse | folding collapse event of menu | (collapsed: boolean) => void | - |
| headerRender | custom header render method | (props: BasicLayoutProps) => VNode | - |
| rightContentRender | header right content render method | (props: HeaderViewProps) => VNode | - |
| collapsedButtonRender | custom collapsed button method | (collapsed: boolean) => VNode | - |

> 由于文档正在编写，可能与实际 API 不一致，如需请参考 `/example/` 下例子
