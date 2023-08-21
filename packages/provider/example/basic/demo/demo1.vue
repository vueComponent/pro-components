<docs>
---
title: 基础用法
---
这是pro-provider的基础用法
</docs>

<script setup lang="ts">
import ProProvider from '@ant-design-vue/pro-provider'
import { Button } from 'ant-design-vue/es'
import { reactive, shallowRef } from 'vue'
const themeColor = reactive<Record<string, any>>({
  token: {
    colorPrimary: 'red'
  }
})
const dark = shallowRef(false)
const handleChange = () => {
  themeColor.token.colorPrimary = 'blue'
  dark.value = true
}
</script>

<template>
  <ProProvider :theme="themeColor" :dark="dark">
    <Button @click="handleChange">按钮</Button>
  </ProProvider>
</template>

<style scoped></style>
