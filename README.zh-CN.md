English | [简体中文](./README.zh-CN.md)

<h1 align="center">Ant Design Pro Layout</h1>

## 使用

```bash
npm i @ant-design-vue/pro-layout --save
// 或者
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
| title | layout 的 左上角 的 title | VNode \| String | `'Ant Design Pro'` |
| logo | layout 的 左上角 logo 的 url | VNode \| render | - |
| loading`*` | layout 的加载态 | boolean | - |
| menuHeaderRender | 渲染 logo 和 title | VNode \| (logo,title)=>VNode | - |
| layout | layout 的菜单模式, sidemenu: 右侧导航, topmenu: 顶部导航 | 'sidemenu' \| 'topmenu' | `'sidemenu'` |
| contentWidth | layout 的内容模式,Fluid：定宽 1200px，Fixed：自适应 | true \| false | `false` |
| theme | 导航的主题 | 'light' \| 'dark' | `'dark'` |
| menus | Vue-router `routes` 属性 | Object | `[{}]` |
| collapsed | 控制菜单的收起和展开 | boolean | true |
| handleCollapse | 菜单的折叠收起事件	 | (collapsed: boolean) => void | - |
| headerRender | 自定义头的 render 方法 | (props: BasicLayoutProps) => VNode | - |
| rightContentRender | 自定义头右部的 render 方法 | (props: HeaderViewProps) => VNode | - |
| collapsedButtonRender | 自定义 collapsed button 的方法 | (collapsed: boolean) => VNode | - |
