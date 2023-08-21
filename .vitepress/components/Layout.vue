<script setup lang="ts">
import Theme from 'vitepress/theme'
import ProProvider, { zhCNIntl } from '@ant-design-vue/pro-provider'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import dayjs from 'dayjs'
import DayJSzhCN from 'dayjs/locale/zh-cn.js'
dayjs.locale(DayJSzhCN)
const ThemeLayout = Theme.Layout
</script>

<template>
  <ProProvider :locale="zhCN" :intl="zhCNIntl">
    <ThemeLayout />
  </ProProvider>
</template>
