<docs>
---
title: 完整测试例子
---

项目完整测试例子
</docs>

<script setup lang="ts">
import {
  ProForm,
  ProFormCaptcha,
  ProFormCascader,
  ProFormCheckbox,
  ProFormCheckboxGroup,
  ProFormDateMonthRangePicker,
  ProFormDatePicker,
  ProFormDateQuarterRangePicker,
  ProFormDateRangePicker,
  ProFormDateTimePicker,
  ProFormDateTimeRangePicker,
  ProFormDateWeekRangePicker,
  ProFormDateYearRangePicker,
  ProFormDigit,
  ProFormDigitRange,
  ProFormMoney,
  ProFormPassword,
  ProFormRadio,
  ProFormRate,
  ProFormSegmented,
  ProFormSelect,
  ProFormSlider,
  ProFormSwitch,
  ProFormText,
  ProFormTextarea,
  ProFormTimePicker,
  ProFormTimeRangePicker,
  ProFormTreeSelect
} from '@ant-design-vue/pro-form'
import { reactive, shallowRef } from 'vue'
const request = (data: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data)
    }, 3000)
  })
}
const model = reactive<Record<string, any>>({
  val1: false,
  val2: ['open'],
  val3: undefined,
  val4: undefined,
  val5: undefined,
  val6: undefined,
  val7: undefined,
  val8: undefined,
  val15: undefined,
  val20: 'jack',
  val22: 0
})
const optSegmented = shallowRef([
  {
    value: 'jack',
    label: 'Jack'
  },
  {
    value: 'lucy',
    label: 'Lucy'
  },
  {
    value: 'disabled',
    label: 'Disabled',
    disabled: true
  },
  {
    value: 'yiminghe',
    label: 'Yiminghe'
  }
])
const valueEnum = reactive({
  all: { text: '全部', disabled: true, status: 'Default' },
  open: {
    text: '未解决',
    status: 'Error'
  },
  closed: {
    text: '已解决',
    status: 'Success'
  },
  processing: {
    text: '解决中',
    status: 'Processing'
  }
})
const val4Options = shallowRef([
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake'
          }
        ]
      }
    ]
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men'
          }
        ]
      }
    ]
  }
])
const handleFinish = (data: any) => {
  // eslint-disable-next-line no-console
  console.log(data)
}
const handleGetCaptcha = async (mobile: string) => {
  // eslint-disable-next-line no-console
  console.log('getCaptcha', mobile)
  await request(mobile)
}
const treeData = [
  {
    label: 'parent 1',
    value: 'parent 1',
    children: [
      {
        label: 'parent 1-1',
        value: 'parent 1-1',
        children: [
          {
            label: 'parent 1-1-0',
            value: 'parent 1-1-0',
            children: [
              {
                label: 'my leaf',
                value: 'leaf1'
              },
              {
                label: 'your leaf',
                value: 'leaf2'
              }
            ]
          },
          {
            label: 'parent 1-2',
            value: 'parent 1-2'
          }
        ]
      },
      {
        label: 'parent 1-3',
        value: 'parent 1-3'
      }
    ]
  }
]
const treeDataRequest = (): Promise<any[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(treeData)
    }, 3000)
  })
}
</script>

<template>
  <div>
    <ProForm :model="model" @finish="handleFinish">
      <ProFormCheckbox v-model:value="model.val1" label="测试" name="val1">
        内容
      </ProFormCheckbox>
      <ProFormCheckboxGroup
        v-model:value="model.val2"
        label="checkboxGroup"
        name="val2"
        :value-enum="valueEnum"
      ></ProFormCheckboxGroup>
      <ProFormCaptcha
        v-model:value="model.val3"
        label="验证码"
        name="val3"
        @get-captcha="handleGetCaptcha"
      ></ProFormCaptcha>
      <ProFormCascader
        v-model:value="model.val4"
        label="级联"
        name="val4"
        :options="val4Options"
      ></ProFormCascader>
      <ProFormDateMonthRangePicker
        v-model:value="model.val5"
        name="val5"
        label="月份区间"
      ></ProFormDateMonthRangePicker>
      <ProFormDatePicker v-model:value="model.val6" label="日期" name="val6" />
      <ProFormDateQuarterRangePicker
        v-model:value="model.val7"
        name="val7"
        label="季度区间"
      />
      <ProFormDateRangePicker
        v-model:value="model.val8"
        label="日期区间"
        name="val8"
      />
      <ProFormDateTimePicker
        v-model:value="model.val9"
        name="val9"
        label="日期时间"
      />
      <ProFormDateTimeRangePicker
        v-model:value="model.val10"
        name="val10"
        label="日期时间区间"
      />
      <ProFormTimeRangePicker
        v-model:value="model.val11"
        name="val11"
        label="时间区间"
      />
      <ProFormTimePicker
        v-model:value="model.val12"
        name="val12"
        label="时间"
      />
      <ProFormDateWeekRangePicker
        v-model:value="model.val13"
        name="val13"
        label="周区间"
      />
      <ProFormDateYearRangePicker
        v-model:value="model.val14"
        name="val14"
        label="年区间"
      />
      <ProFormDigit v-model:value="model.val15" name="val15" label="数字" />
      <ProFormDigitRange
        v-model:value="model.val16"
        name="val16"
        label="数字区间"
      />
      <ProFormMoney v-model:value="model.val17" name="val17" label="金钱" />
      <ProFormRadio v-model:value="model.val18" name="val18" label="单选" />
      <ProFormRate v-model:value="model.val19" name="val19" label="收藏" />
      <ProFormSegmented
        v-model:value="model.val20"
        :options="optSegmented"
        name="val20"
        label="分段器"
      />
      <ProFormSelect
        v-model:value="model.val21"
        :options="optSegmented"
        name="val21"
        label="单选框"
      />
      <ProFormSlider v-model:value="model.val22" name="val22" label="滑块" />
      <ProFormSwitch v-model:value="model.val23" name="val23" label="单选" />
      <ProFormText v-model:value="model.val24" name="val24" label="输入框" />
      <ProFormPassword
        v-model:value="model.val25"
        name="val25"
        label="密码框"
      />
      <ProFormTextarea
        v-model:value="model.val26"
        name="val26"
        label="文本域"
      />
      <ProFormTreeSelect
        v-model:value="model.val27"
        :request="treeDataRequest"
        name="val27"
        label="树下拉选择"
      />
    </ProForm>
  </div>
</template>
