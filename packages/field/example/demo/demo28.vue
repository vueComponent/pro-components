<docs>
---
title: 可输入的模式
---

用于输入的情况，可以直接使用`v-model:value`的方式进行绑定
</docs>

<script setup lang="ts">
import ProField from '@ant-design-vue/pro-field'
import { reactive } from 'vue'
const val = reactive({
  date: '2023-06-13',
  dateWeek: undefined,
  dateYear: undefined,
  dateQuarter: undefined,
  dateMonth: undefined,
  dateTime: undefined
})
</script>

<template>
  <div class="flex flex-col gap-2">
    <div>
      年月日：
      <ProField v-model:value="val.date" value-type="date" mode="edit" />
      <ProField v-model:value="val.date" value-type="date" mode="edit" light />
      <ProField v-model:value="val.date" value-type="date" />
    </div>
    <div>
      周：
      <ProField
        v-model:value="val.dateWeek"
        value-type="dateWeek"
        mode="edit"
      />
      <ProField
        v-model:value="val.dateWeek"
        value-type="dateWeek"
        mode="edit"
        light
      />
      <ProField v-model:value="val.dateWeek" value-type="dateWeek" />
    </div>

    <div>
      年：
      <ProField
        v-model:value="val.dateYear"
        value-type="dateYear"
        mode="edit"
      />
      <ProField
        v-model:value="val.dateYear"
        value-type="dateYear"
        mode="edit"
        light
      />
      <ProField v-model:value="val.dateYear" value-type="dateYear" />
    </div>
    <div>
      季度：
      <ProField
        v-model:value="val.dateQuarter"
        value-type="dateQuarter"
        mode="edit"
      />
      <ProField
        v-model:value="val.dateQuarter"
        value-type="dateQuarter"
        mode="edit"
        light
      />
      <ProField v-model:value="val.dateQuarter" value-type="dateQuarter" />
    </div>

    <div>
      月：
      <ProField
        v-model:value="val.dateMonth"
        value-type="dateMonth"
        mode="edit"
      />
      <ProField
        v-model:value="val.dateMonth"
        value-type="dateMonth"
        mode="edit"
        light
      />
      <ProField v-model:value="val.dateMonth" value-type="dateMonth" />
    </div>
    <div>
      年月日时分秒：
      <ProField
        v-model:value="val.dateTime"
        value-type="dateTime"
        mode="edit"
      />
      <ProField
        v-model:value="val.dateTime"
        value-type="dateTime"
        mode="edit"
        light
      />
      <ProField v-model:value="val.dateTime" value-type="dateTime" />
    </div>
  </div>
</template>
