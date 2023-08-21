<docs>
---
title: FormItem
---

通过FormItem使用ProForm
</docs>

<script setup lang="ts">
import { ProForm } from '@ant-design-vue/pro-form'
import ProField from '@ant-design-vue/pro-field'
import { FormItem } from 'ant-design-vue'
import { reactive, shallowRef } from 'vue'
const model = reactive({
  username: '',
  password: ''
})
const formRef = shallowRef()
const handleFinish = (values: any) => {
  // eslint-disable-next-line no-console
  console.log(values)
}
</script>

<template>
  <ProForm ref="formRef" :model="model" @finish="handleFinish">
    <FormItem
      label="账号"
      name="username"
      :rules="[{ required: true, message: '账户不能为空' }]"
    >
      <ProField v-model:value="model.username" mode="edit" />
    </FormItem>
    <FormItem
      label="密码"
      name="password"
      :rules="[
        { required: true, message: '账户不能为空' },
        { min: 5, max: 10, message: '密码的长度不能小于五位且不能大于十位' }
      ]"
    >
      <ProField
        v-model:value="model.password"
        value-type="password"
        mode="edit"
      />
    </FormItem>
  </ProForm>
</template>
