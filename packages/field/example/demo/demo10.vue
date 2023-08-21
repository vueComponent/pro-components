<docs>
---
title: valueEnum模式
---

使用`value-enum`模式
</docs>

<script setup lang="ts">
import ProField from '@ant-design-vue/pro-field'
import { reactive, shallowRef } from 'vue'
const val = shallowRef('jack')

const valueEnum = reactive({
  jack: {
    text: 'Jack',
    status: 'processing'
  },
  lucy: {
    text: 'Lucy',
    status: 'success'
  },
  disabled: {
    text: 'Disabled',
    disabled: true
  }
})
</script>

<template>
  <div>
    <ProField
      v-model:value="val"
      value-type="select"
      :value-enum="valueEnum"
      mode="edit"
      style="width: 150px"
    ></ProField>
    <br />
    <br />
    <ProField
      :value="val"
      value-type="select"
      :value-enum="valueEnum"
    ></ProField>
  </div>
</template>
