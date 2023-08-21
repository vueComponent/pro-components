<script setup lang="ts">
import { ProFormText, QueryFilter } from '@ant-design-vue/pro-form'
import { reactive } from 'vue'
const model = reactive({
  val1: undefined,
  val3: undefined,
  val2: undefined
})
</script>

<template>
  <div>
    <QueryFilter :model="model">
      <ProFormText v-model:value="model.val1" label="测试" name="val1">
        内容
      </ProFormText>
      <ProFormText v-model:value="model.val2" label="测试" name="val2">
        内容
      </ProFormText>
      <ProFormText v-model:value="model.val3" label="测试" name="val3">
        内容
      </ProFormText>
    </QueryFilter>
  </div>
</template>

<style scoped></style>
