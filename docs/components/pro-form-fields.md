<h1 align="center">
ProFormFields 表单项
</h1>

### ProFormText

ProFormText 是 FormItem + Input 的产物

```vue
<ProFormItem>
  <Input v-model:value="value" />
</ProFormItem>
```

::: warning
ProFormText 设置的 props 其实是 Form.Item 的，fieldProps 才是包含的组件的
:::

demo

```vue
<ProFormText
  v-model:value="formModel.name"
  name="name"
  label="应用名称"
  :field-props="{
    allowClear: true,
    placeholder: '请输入',
  }"
  required
/>
```

## 更多原子化组件开发中...
