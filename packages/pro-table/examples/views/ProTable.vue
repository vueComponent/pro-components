<script lang="ts" setup>
import ProTable, { type ProColumnsType } from '@ant-design-vue/pro-table';
import axios from 'axios';

const columns: ProColumnsType = [
  {
    title: 'Name',
    dataIndex: 'name',
    fixed: 'left',
    sorter: true,
    search: true,
    width: '20%',
  },
  {
    title: 'Gender',
    dataIndex: 'gender',
    filters: [
      { text: 'Male', value: 'male' },
      { text: 'Female', value: 'female' },
    ],
    width: '20%',
    search: true,
  },
  {
    title: 'Post Code',
    dataIndex: ['location', 'postcode'],
  },
  {
    title: 'City',
    dataIndex: ['location', 'city'],
  },
  {
    title: 'State',
    dataIndex: ['location', 'state'],
  },
  {
    title: 'Country',
    dataIndex: ['location', 'country'],
  },
  {
    title: 'Age',
    dataIndex: ['registered', 'age'],
  },
  {
    title: 'Phone',
    dataIndex: 'phone',
    search: true,
  },
  {
    title: 'Cell',
    dataIndex: 'cell',
    search: true,
    fixed: 'right',
  },
];

const request = async ({
  current,
  pageSize,
  ...others
}: {
  current: number;
  pageSize: number;
  [key: string]: unknown;
}) => {
  const {
    data: { results },
  } = await axios.get<{
    results: Record<string, unknown>[];
  }>('https://randomuser.me/api?noinfo', {
    params: {
      results: pageSize,
      page: current,
      ...others,
    },
  });
  return {
    data: results,
    total: 200,
  };
};
</script>
<template>
  <pro-table
    :columns="columns"
    :row-key="record => record.login.uuid"
    :request="request"
    :options="{ density: true, fullScreen: true }"
  >
    <template #bodyCell="{ column, text }">
      <template v-if="column.dataIndex === 'name'">{{ text.first }} {{ text.last }}</template>
    </template>
  </pro-table>
</template>
