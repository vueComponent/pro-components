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
  dateRange: [],
  dateWeekRange: [],
  dateYearRange: [],
  dateQuarterRange: [],
  dateMonthRange: [],
  dateTimeRange: []
})
</script>

<template>
  <div class="flex flex-col gap-2">
    <div>
      年月日：
      <ProField
        v-model:value="val.dateRange"
        value-type="dateRange"
        mode="edit"
      />
      <ProField
        v-model:value="val.dateRange"
        value-type="dateRange"
        mode="edit"
        light
      />
      <ProField v-model:value="val.dateRange" value-type="dateRange" />
    </div>
    <div>
      周：
      <ProField
        v-model:value="val.dateWeekRange"
        value-type="dateWeekRange"
        mode="edit"
      />
      <ProField
        v-model:value="val.dateWeekRange"
        value-type="dateWeekRange"
        mode="edit"
        light
      />
      <ProField v-model:value="val.dateWeekRange" value-type="dateWeekRange" />
    </div>

    <div>
      年：
      <ProField
        v-model:value="val.dateYearRange"
        value-type="dateYearRange"
        mode="edit"
      />
      <ProField
        v-model:value="val.dateYearRange"
        value-type="dateYearRange"
        mode="edit"
        light
      />
      <ProField v-model:value="val.dateYearRange" value-type="dateYearRange" />
    </div>
    <div>
      季度：
      <ProField
        v-model:value="val.dateQuarterRange"
        value-type="dateQuarterRange"
        mode="edit"
      />
      <ProField
        v-model:value="val.dateQuarterRange"
        value-type="dateQuarterRange"
        mode="edit"
        light
      />
      <ProField
        v-model:value="val.dateQuarterRange"
        value-type="dateQuarterRange"
      />
    </div>

    <div>
      月：
      <ProField
        v-model:value="val.dateMonthRange"
        value-type="dateMonthRange"
        mode="edit"
      />
      <ProField
        v-model:value="val.dateMonthRange"
        value-type="dateMonthRange"
        mode="edit"
        light
      />
      <ProField
        v-model:value="val.dateMonthRange"
        value-type="dateMonthRange"
      />
    </div>
    <div>
      年月日时分秒：
      <ProField
        v-model:value="val.dateTimeRange"
        value-type="dateTimeRange"
        mode="edit"
      />
      <ProField
        v-model:value="val.dateTimeRange"
        value-type="dateTimeRange"
        mode="edit"
        light
      />
      <ProField v-model:value="val.dateTimeRange" value-type="dateTimeRange" />
    </div>
  </div>
</template>
