<docs>
---
title: 显示模式
---

默认情况下用于显示数据
</docs>

<script setup lang="ts">
import ProField from '@ant-design-vue/pro-field'
import { shallowRef } from 'vue'
const val = shallowRef(1)
</script>

<template>
  <ProField :value="val" value-type="index" />
  <br />
  <br />
  <ProField :value="0" value-type="indexBorder" />
  <ProField :value="1" value-type="indexBorder" />
  <ProField :value="2" value-type="indexBorder" />
  <ProField :value="3" value-type="indexBorder" />
</template>
