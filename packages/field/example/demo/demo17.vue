<docs>
---
title: 可输入的模式
---

用于输入的情况，可以直接使用`v-model:value`的方式进行绑定
</docs>

<script setup lang="ts">
import ProField from '@ant-design-vue/pro-field'
import { reactive, shallowRef } from 'vue'
const val = shallowRef('open')
const valueEnum = reactive({
  all: { text: '全部', disabled: true, status: 'Default' },
  open: {
    text: '未解决',
    status: 'Error'
  },
  closed: {
    text: '已解决',
    status: 'Success'
  },
  processing: {
    text: '解决中',
    status: 'Processing'
  }
})
</script>

<template>
  <ProField
    v-model:value="val"
    value-type="radio"
    :value-enum="valueEnum"
    mode="edit"
  />
  <br />
  <br />
  <ProField :value="val" value-type="radio" :value-enum="valueEnum" />
</template>
