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
const options = shallowRef([
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
])
</script>

<template>
  <div>
    <ProField
      v-model:value="val"
      :options="options"
      value-type="segmented"
      mode="edit"
    ></ProField>
  </div>
</template>
