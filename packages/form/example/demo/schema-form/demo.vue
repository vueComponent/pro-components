<docs>
---
title: 测试schema的例子
---

测试schema的例子
</docs>

<script setup lang="ts">
import { BetaSchemaForm } from '@ant-design-vue/pro-form'
const columns = [
  {
    title: '#',
    dataIndex: 'index',
    valueType: 'indexBorder'
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '状态',
    dataIndex: 'status',
    valueEnum: {
      all: { text: '全部', status: 'Default' },
      close: { text: '关闭', status: 'Default' },
      running: { text: '运行中', status: 'Processing' },
      online: { text: '已上线', status: 'Success' },
      error: { text: '异常', status: 'Error' }
    }
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
    hideInForm: true
  },
  {
    title: 'Action',
    key: 'action',
    hideInForm: true
  }
]
const handleFinish = (model: Record<string, any>) => {
  console.log(model)
}
</script>

<template>
  <div>
    <BetaSchemaForm
      :columns="columns"
      layout-type="QueryFilter"
      @finish="handleFinish"
    />
  </div>
</template>

<style scoped></style>
