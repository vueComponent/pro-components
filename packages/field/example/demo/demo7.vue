<docs>
---
title: 只读模式
---

只用于内容显示的功能
</docs>

<script setup lang="ts">
import ProField from '@ant-design-vue/pro-field'
import { shallowRef } from 'vue'
const val = shallowRef(10)
</script>

<template>
  <div>
    <ProField v-model:value="val" value-type="slider"></ProField>
  </div>
</template>
