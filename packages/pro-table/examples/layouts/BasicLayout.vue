<template>
  <pro-table :request="request" :columns="columns" :bordered="true"></pro-table>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watchEffect, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  message,
  Button,
  Input,
  Switch,
  Select,
  Avatar,
  Space,
  Badge,
  Menu,
} from "ant-design-vue";
import type { ColumnsType } from "ant-design-vue/lib/vc-table/interface";
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
const data = [{ name: 123, age: 18 }];
const i18n = (t: string) => t;
const request = new Promise((resolve, reject) => {
  resolve({
    data,
    success: true,
    total: 100
  })
})
const loading = ref(false);
const router = useRouter();

const handleSearch = () => {
  message.info("search..");
};
</script>
