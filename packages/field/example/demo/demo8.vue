<docs>
---
title: 可编辑模式
---

使用`v-model:value`双向绑定实现可编辑模式
</docs>

<script setup lang="ts">
import ProField from '@ant-design-vue/pro-field'
import { shallowRef } from 'vue'
const val = shallowRef(10)
</script>

<template>
  <div>
    <ProField v-model:value="val" value-type="slider" mode="edit"></ProField>
  </div>
</template>
