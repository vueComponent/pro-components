<docs>
---
title: 可输入模式
---

用于输入的情况，可以直接使用`v-model:value`的方式进行绑定
</docs>

<script setup lang="ts">
import ProField from '@ant-design-vue/pro-field'
import { shallowRef } from 'vue'
const val = shallowRef(true)
</script>

<template>
  <div class="flex gap-2">
    <ProField v-model:value="val" mode="edit" value-type="switch" />
    <ProField v-model:value="val" value-type="switch" />
  </div>
</template>
