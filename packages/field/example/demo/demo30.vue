<docs>
---
title: 可输入的模式
---

用于输入的情况，可以直接使用`v-model:value`的方式进行绑定
</docs>

<script setup lang="ts">
import ProField from '@ant-design-vue/pro-field'
import { shallowRef } from 'vue'
const val = shallowRef(['zhejiang', 'hangzhou', 'xihu'])

const request = async () => [
  {
    value: 'zhejiang',
    name: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        name: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            name: 'West Lake'
          }
        ]
      }
    ]
  },
  {
    value: 'jiangsu',
    name: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        name: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            name: 'Zhong Hua Men'
          }
        ]
      }
    ]
  }
]
</script>

<template>
  <ProField
    v-model:value="val"
    value-type="cascader"
    :request="request"
    mode="edit"
    :field-props="{
      fieldNames: {
        label: 'name'
      }
    }"
  />
  <br />
  <br />
  <ProField
    :value="val"
    value-type="cascader"
    :field-props="{
      fieldNames: {
        label: 'name'
      }
    }"
    :request="request"
  />
</template>
