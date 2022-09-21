<template>
  <div>
    grid开关
    <Switch v-model:checked="grid" />
  </div>
  <br />
  <div>
    只读
    <Switch v-model:checked="readonly" />
  </div>
  <br />
  <div>
    标签布局
    <RadioGroup v-model:value="formLayoutType">
      <RadioButton v-for="layout in layouts" :key="layout" :value="layout">{{ layout }}</RadioButton>
    </RadioGroup>
  </div>
  <br />
  <pro-form
    v-model:model="formModel"
    :readonly="readonly"
    :layout="formLayoutType"
    :grid="grid"
    :col-props="{
      span: 8,
    }"
    @finish="handleSubmit"
  >
    <pro-form-text
      name="name"
      label="应用名称"
      :field-props="{
        allowClear: true,
        placeholder: '请输入',
      }"
      required
    />
    <pro-form-text
      name="name2"
      label="应用名称2"
      :field-props="{
        allowClear: true,
        placeholder: '请输入',
      }"
      required
    />
    <pro-form-text
      name="name3"
      label="应用名称3"
      :field-props="{
        allowClear: true,
        placeholder: '请输入',
      }"
      required
    />
    <pro-form-text
      name="name4"
      label="应用名称4"
      :field-props="{
        allowClear: true,
        placeholder: '请输入',
      }"
      required
    />
    <pro-form-text
      name="name5"
      label="应用名称5"
      :field-props="{
        allowClear: true,
        placeholder: '请输入',
      }"
      required
    />
    <pro-form-text
      name="name6"
      label="应用名称6"
      :col-props="{
        xl: 8,
        md: 12,
      }"
      :field-props="{
        allowClear: true,
        placeholder: '请输入',
      }"
      required
    />
    <pro-form-text
      name="name79"
      label="应用名称7"
      :field-props="{
        allowClear: true,
        placeholder: '请输入',
      }"
      required
    />
    <pro-form-password
      name="password"
      label="密码"
      :field-props="{
        allowClear: true,
        placeholder: '请输入',
      }"
      required
    />
    <pro-form-select
      name="gender"
      label="性别"
      :options="sex"
      :field-props="{
        placeholder: '请选择',
      }"
      required
    >
      <template #option="{ value: val, label, icon }">
        <span role="img" :aria-label="val">{{ icon }}</span>
        &nbsp;&nbsp;{{ label }}
      </template>
    </pro-form-select>
    <pro-form-select
      name="girlName"
      label="Girl姓名"
      :field-props="{
        placeholder: '请选择',
        mode: 'multiple',
        options: girlNameoptions,
      }"
      required
    >
      <template #dropdownRender="{ menuNode: menu }">
        <v-nodes :vnodes="menu" />
        <Divider style="margin: 4px 0" />
        <div style="padding: 4px 8px; cursor: pointer" @mousedown="(e) => e.preventDefault()" @click="addItem">
          <plus-outlined />
          Add item
        </div>
      </template>
    </pro-form-select>
  </pro-form>
</template>

<script lang="ts" setup>
import { reactive, ref, FunctionalComponent } from 'vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { RadioGroup, RadioButton, Switch, Divider, type SelectProps } from 'ant-design-vue';
import type { FormLayout } from 'ant-design-vue/es/form/Form';
import { ProForm, ProFormText, ProFormPassword, ProFormSelect } from '@ant-design-vue/pro-form';

const layouts = ['horizontal', 'vertical', 'inline'];

const formModel = reactive({
  name: '456',
  name2: '567',
  name3: 'xxx',
  name4: '',
  name5: '',
  name6: '',
  name7: '',
  password: '111',
  gender: '女',
  girlName: undefined,
});

const sex = ref([
  {
    value: '男',
    label: '男',
    icon: '🇨🇳',
  },
  {
    value: '女',
    label: '女',
    icon: '🇺🇸',
  },
]);

const girlNameoptions = ref<SelectProps['options']>([
  {
    label: 'Manager',
    options: [
      {
        value: 'jack',
        label: 'Jack',
      },
      {
        value: 'lucy',
        label: 'Lucy',
      },
    ],
  },
  {
    label: 'Engineer',
    options: [
      {
        value: 'yiminghe',
        label: 'Yiminghe',
      },
    ],
  },
]);

const formLayoutType = ref<FormLayout>('horizontal');
const grid = ref(true);
const readonly = ref(false);

const handleSubmit = (value: any) => {
  console.log(value);
};

const VNodes: FunctionalComponent = (_, { attrs }) => {
  return attrs.vnodes;
};

let index = 0;
const addItem = () => {
  girlNameoptions.value?.[1].options.push({
    value: index++,
    label: `Item${index++}`,
  });
};
</script>
