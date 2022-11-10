<template>
  <QueryFilter :model="formModel" @finish="handleSubmit" @collapsed="onCollapsed">
    <ProFormText
      name="name"
      label="应用名称"
      :field-props="{
        allowClear: true,
        placeholder: '请输入',
      }"
      required
    />
    <pro-form-select
      name="country"
      label="国家"
      :field-props="{
        showSearch: true,
        mode: 'multiple',
        filterOption: false,
      }"
      :request="fetchUser"
    >
      <template #placeholder> 请选择国家 </template>
    </pro-form-select>
    <pro-form-date-picker
      name="expirationTime"
      label="合同失效时间"
      :field-props="{
        placeholder: '请选择合同失效时间',
        format: customFormat,
      }"
    >
      <template #superPrevIcon>
        <plus-outlined />
      </template>
      <template #renderExtraFooter>extra footer</template>
      <template #dateRender="{ current }">
        <div class="ant-picker-cell-inner" :style="getCurrentStyle(current)">
          {{ current.date() }}
        </div>
      </template>
    </pro-form-date-picker>
    <pro-form-date-range-picker
      name="rangeTimes"
      label="开始结束时间"
      :field-props="{
        placeholder: ['请选择开始时间', '请选择结束时间'],
        showTime: true,
        format: 'YYYY/MM/DD HH:mm:ss',
      }"
    >
      <template #renderExtraFooter>extra footer</template>
      <template #dateRender="{ current }">
        <div class="ant-picker-cell-inner" :style="getCurrentStyle(current)">
          {{ current.date() }}
        </div>
      </template>
    </pro-form-date-range-picker>
    <pro-form-date-picker-week
      name="weakTime"
      label="选择周"
      :field-props="{
        placeholder: '请选择周时间',
      }"
    >
      <template #renderExtraFooter>extra footer</template>
    </pro-form-date-picker-week>
    <ProFormDatePickerYear
      name="yearTime"
      label="选择年"
      :field-props="{
        placeholder: '请选择年时间',
      }"
    />
  </QueryFilter>
</template>

<script lang="ts" setup>
import { ref, reactive, CSSProperties } from 'vue';
import dayjs, { type Dayjs } from 'dayjs';
import {
  QueryFilter,
  ProFormText,
  ProFormSelect,
  ProFormDatePicker,
  ProFormDateRangePicker,
  ProFormDatePickerWeek,
  ProFormDatePickerYear,
} from '@ant-design-vue/pro-form';

const dateFormat = 'YYYY/MM/DD';

type RangeValue = [Dayjs, Dayjs];

let lastFetchId = 0;
const fetchUser = async () => {
  lastFetchId += 1;
  const fetchId = lastFetchId;
  const response = await fetch('https://randomuser.me/api/?results=5');
  const body = await response.json();
  if (fetchId !== lastFetchId) {
    // for fetch callback order
    return;
  }
  return body.results.map((user: any) => ({
    label: `${user.name.first} ${user.name.last}`,
    value: user.login.username,
  }));
};

const formModel = reactive({
  name: '456',
  country: undefined,
  expirationTime: ref<Dayjs>(dayjs('2015/01/01', dateFormat)),
  rangeTimes: ref<RangeValue>(),
  weakTime: ref<Dayjs>(),
  yearTime: ref<Dayjs>(),
});

const customFormat = (value: Dayjs) => `custom format: ${value?.format('YYYY-MM-DD')}`;

const getCurrentStyle = (current: Dayjs) => {
  const style: CSSProperties = {};

  if (current.date() === 2) {
    style.border = '1px solid #1890ff';
    style.borderRadius = '50%';
  }

  return style;
};

function handleSubmit(params: any) {
  console.log(params);
}
function onCollapsed(collapsed: boolean) {
  console.log(collapsed);
}
</script>
