<template>
    <pro-table
        @change="handleChane"
        :request="request"
        :columns="columns"
        :bordered="true"
        :pagination="pagination"
    >
        <template #bodyCell="{ column, text, record }">
            <div v-if="column.dataIndex === 'action'">点击</div>
            <div v-else>{{ text }}</div>
        </template>
    </pro-table>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';

import type { ColumnsType } from '@ant-design-vue/pro-table';
const handleChane = values => {
    console.log(values, '分页');
};
const pagination = reactive({
    pageSize: 10
});
const columns = reactive<ColumnsType>([
    {
        dataIndex: 'name',
        title: '姓名',
        key: 'name',
        search: true
    },
    {
        dataIndex: 'age',
        title: '年龄',
        key: 'age',
        search: true
    },
    {
        dataIndex: 'action',
        title: '操作',
        key: 'action',
        disabled: true
    }
]);
const request = async (params: any = {}) => {
    let data: any[] = [];

    console.log('params', params);
    for (let i = 0; i < params.pageSize; i++) {
        data.push({
            name: '第' + params.current + '页的' + +(i + 1) + (params?.name || ''),
            age: 18
        });
    }
    return {
        data,
        success: true,
        total: 100
    };
};
</script>
