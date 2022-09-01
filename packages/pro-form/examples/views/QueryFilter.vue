<template>
  <QueryFilter :model="formModel" @finish="handleSubmit" @collapsed="onCollapsed">
    <ProFormText
      v-model:value="formModel.name2"
      name="name2"
      label="应用名称2"
      :field-props="{
        allowClear: true,
        placeholder: '请输入',
      }"
      required
    />
    <FormItem name="name" label="应用名称" required>
      <Input v-model:value="formModel.name" placeholder="请输入" allow-clear />
    </FormItem>
    <FormItem name="creater" label="创建人" required>
      <Input v-model:value="formModel.creater" placeholder="请输入" />
    </FormItem>
    <FormItem name="sex" label="性别" required>
      <Select v-model:value="formModel.sex">
        <SelectOption v-for="item in sex" :key="item.value" :value="item.value">{{ item.label }}</SelectOption>
      </Select>
    </FormItem>
    <FormItem name="status" label="应用状态">
      <Input v-model:value="formModel.status" placeholder="请输入" />
    </FormItem>
    <FormItem name="startDate" label="响应日期">
      <DatePicker v-model:value="formModel.startDate" placeholder="请输入" />
    </FormItem>
    <FormItem name="create" label="创建时间">
      <RangePicker v-model:value="formModel.create" :placeholder="['开始时间', '结束时间']" />
    </FormItem>
  </QueryFilter>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue';
import { QueryFilter, ProFormText } from '@ant-design-vue/pro-form';
import dayjs, { type Dayjs } from 'dayjs';
import { FormItem, Input, Select, SelectOption, RangePicker, DatePicker } from 'ant-design-vue';

const formModel = reactive({
  name2: '456',
  name: '123',
  creater: '11',
  sex: '男',
  status: '',
  startDate: '',
  create: [dayjs('2015/01/01', 'YYYY/MM/DD'), dayjs('2016/01/01', 'YYYY/MM/DD')] as [Dayjs, Dayjs],
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
