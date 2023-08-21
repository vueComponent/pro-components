<docs>
---
title: 可输入的模式
---

用于输入的情况，可以直接使用`v-model:value`的方式进行绑定
</docs>

<script setup lang="ts">
import ProField from '@ant-design-vue/pro-field'
import { shallowRef } from 'vue'
const val = shallowRef('123456')
</script>

<template>
  <ProField v-model:value="val" value-type="password" mode="edit" />
  <br />
  <br />
  <ProField :value="val" value-type="password" />
</template>
