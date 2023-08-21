<docs>
---
title: 结合ProFormField使用
---

使用ProFormField实现表单项的统一样式
</docs>

<script setup lang="ts">
import { ProForm, ProFormField } from '@ant-design-vue/pro-form'
import { reactive } from 'vue'
const model = reactive({
  username: '',
  password: ''
})

const handleFinish = (values: any) => {
  // eslint-disable-next-line no-console
  console.log(values)
}
</script>

<template>
  <ProForm :model="model" @finish="handleFinish">
    <ProFormField
      v-model:value="model.username"
      label="账号"
      name="username"
      :rules="[{ required: true, message: '账户不能为空' }]"
    />
    <ProFormField
      v-model:value="model.password"
      label="密码"
      value-type="password"
      name="password"
      :rules="[
        { required: true, message: '账户不能为空' },
        { min: 5, max: 10, message: '密码的长度不能小于五位且不能大于十位' }
      ]"
    />
  </ProForm>
</template>
