<docs>
---
title: 基础用法
---
这是ProTable的基础用法
</docs>

<script setup lang="ts">
import type { ProColumns } from '@ant-design-vue/pro-table'
import ProTable from '@ant-design-vue/pro-table'
import { Tag } from 'ant-design-vue'
const columns: ProColumns[] = [
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
    search: false
  },
  {
    title: 'Action',
    key: 'action'
  }
]
const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: [
      {
        name: 'bug',
        color: 'error'
      }
    ],
    status: 'running'
  }
]
</script>

<template>
  <ProTable card-bordered :columns="columns" :data-source="data">
    <template #bodyCell="{ column, text }">
      <template v-if="column.key === 'tags'">
        <template v-for="item in text" :key="item.name">
          <Tag :color="item.color">{{ item.name }}</Tag>
        </template>
      </template>
    </template>
  </ProTable>
</template>

<style scoped></style>
