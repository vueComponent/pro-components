<template>
  <ProForm :model="formModel" @finish="handleSubmit">
    <ProFormText
      v-model:value="formModel.name"
      name="name"
      label="应用名称"
      :field-props="{
        allowClear: true,
        placeholder: '请输入',
      }"
      required
    />
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
  </ProForm>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import { ProForm, ProFormText } from '@ant-design-vue/pro-form';

const formModel = reactive({
  name: '456',
  name2: '567',
});

const handleSubmit = (value: any) => {
  console.log(value);
};
</script>
