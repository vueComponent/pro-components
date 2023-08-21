<docs>
---
title: 可输入的模式
---

用于输入的情况，可以直接使用`v-model:value`的方式进行绑定
</docs>

<script setup lang="ts">
import ProField from '@ant-design-vue/pro-field'
import { shallowRef } from 'vue'
const val = shallowRef()
const request = async () => [
  {
    title: 'parent 1',
    value: 'parent 1',
    children: [
      {
        title: 'parent 1-0',
        value: 'parent 1-0',
        children: [
          {
            title: 'my leaf',
            value: 'leaf1'
          },
          {
            title: 'your leaf',
            value: 'leaf2'
          }
        ]
      },
      {
        title: 'parent 1-1',
        value: 'parent 1-1'
      }
    ]
  }
]
const treeData = [
  {
    title: 'parent 1',
    value: 'parent 1',
    children: [
      {
        title: 'parent 1-0',
        value: 'parent 1-0',
        children: [
          {
            title: 'my leaf',
            value: 'leaf1'
          },
          {
            title: 'your leaf',
            value: 'leaf2'
          }
        ]
      },
      {
        title: 'parent 1-1',
        value: 'parent 1-1'
      }
    ]
  }
]
</script>

<template>
  <ProField
    v-model:value="val"
    value-type="treeSelect"
    :request="request"
    class="w-200px"
    mode="edit"
  />

  <ProField
    v-model:value="val"
    value-type="treeSelect"
    :field-props="{
      treeData
    }"
    class="w-200px"
    mode="edit"
  />
</template>
