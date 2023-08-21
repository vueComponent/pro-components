<docs>
---
title: 内容显示模式
---

只用于内容显示的功能
</docs>

<script setup lang="ts">
import ProField from '@ant-design-vue/pro-field'
import { shallowRef } from 'vue'
const val = shallowRef('测试')
</script>

<template>
  <ProField v-model:value="val" />
</template>
