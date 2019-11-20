English | [简体中文](./README.zh-CN.md)

<h1 align="center">Ant Design Pro Layout</h1>

## Usage

```bash
npm i @ant-design-vue/pro-layout --save
// or
yarn add @ant-design-vue/pro-layout
```

```jsx
import ProLayout from '@ant-design-vue/pro-layout'

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
