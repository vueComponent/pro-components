<template>
  <editable-pro-table v-model:value="value" :columns="columns" :data-source="dataSource" />
  {{ JSON.stringify(value) }}
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { EditableProTable, type ProColumnsType } from '@ant-design-vue/pro-table';

const columns: ProColumnsType = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age'
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address'
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags'
  }
];

const dataSource = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park'
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park'
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park'
  }
];

const value = ref<Record<string, unknown>[]>([]);
</script>
