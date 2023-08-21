<script setup lang="ts">
import { ref } from 'vue'
import {
  ProForm,
  ProFormGroup,
  ProFormPassword,
  ProFormRadio
} from '@ant-design-vue/pro-form'
const groupCollapsed = ref(false)
</script>

<template>
  <ProForm>
    <ProFormGroup
      v-model:collapsed="groupCollapsed"
      label="测试分组1"
      collapsible
    >
      <ProFormPassword label="测试密码1" />
      <ProFormRadio label="测试radio1" />
      <ProFormRadio label="测试radio2" />
    </ProFormGroup>
    <ProFormPassword label="测试密码2" />
  </ProForm>
</template>

<style scoped></style>
