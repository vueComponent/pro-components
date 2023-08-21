<docs>
---
title: 可编辑模式
---

使用`v-model:value`双向绑定实现可编辑模式
</docs>

<script setup lang="ts">
import ProField from '@ant-design-vue/pro-field'
import { shallowRef } from 'vue'
const val = shallowRef('jack')
const testReq = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, 3000)
  })
}
const request = async () => {
  await testReq()
  return [
    {
      value: 'jack',
      label: 'Jack'
    },
    {
      value: 'lucy',
      label: 'Lucy'
    },
    {
      value: 'disabled',
      label: 'Disabled',
      disabled: true
    },
    {
      value: 'yiminghe',
      label: 'Yiminghe'
    }
  ]
}
</script>

<template>
  <div>
    <ProField
      v-model:value="val"
      :request="request"
      value-type="select"
      mode="edit"
      style="width: 150px"
    ></ProField>
  </div>
</template>
