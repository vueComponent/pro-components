<template>
  <pro-table :request="request" :columns="columns" :bordered="true" :pagination="pagination"></pro-table>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";

import type { ColumnsType } from "ant-design-vue/lib/vc-table/interface";
const pagination = reactive({
  pageSize: 10,
});
const columns = reactive<ColumnsType>([
  {
    dataIndex: "name",
    title: "姓名",
    key: "name",
  },
  {
    dataIndex: "age",
    title: "年龄",
    key: "age",
  },
]);
const request = async (params: any) => {
  let data: any[] = [];

  console.log("params", params);
  for (let i = 0; i < params.pageSize; i++) {
    data.push({ name: "第" + params.current + "页的" + (i + 1), age: 18 });
  }
  return {
    data,
    success: true,
    total: 100,
  };
};
</script>
