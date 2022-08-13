<template>
  <QueryFilter :model="formModel" split @finish="handleSubmit" @collapsed="onCollapsed">
    <FormItem name="name" label="应用名称" required>
      <Input v-model:value="formModel.name" placeholder="请输入" />
    </FormItem>
    <FormItem name="creater" label="创建人">
      <Input v-model:value="formModel.creater" placeholder="请输入" />
    </FormItem>
    <FormItem name="sex" label="性别">
      <Select v-model:value="formModel.sex">
        <SelectOption v-for="item in sex" :key="item.value" :value="item.value">{{ item.label }}</SelectOption>
      </Select>
    </FormItem>
  </QueryFilter>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { QueryFilter } from '@ant-design-vue/pro-form';
import { FormItem, Input, Select, SelectOption } from 'ant-design-vue';

const formModel = ref({
  name: '123',
  creater: '',
  sex: '男',
});

const sex = ref([
  {
    value: '男',
    label: '男',
  },
  {
    value: '女',
    label: '女',
  },
]);

function handleSubmit(params: any) {
  console.log(params);
}
function onCollapsed(collapsed: boolean) {
  console.log(collapsed);
}
</script>
