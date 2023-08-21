<docs>
---
title: 轻量模式
---

可以通过配置`light`来使用轻量模式
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
  <div flex gap-2>
    <ProField
      v-model:value="val"
      :options="options"
      light
      show-search
      value-type="select"
      mode="edit"
      :bordered="false"
    ></ProField>
    <ProField
      v-model:value="val"
      :options="options"
      light
      show-search
      value-type="select"
      mode="edit"
    ></ProField>
  </div>
</template>
