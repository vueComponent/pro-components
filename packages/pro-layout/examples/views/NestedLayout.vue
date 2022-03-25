<template>
  <pro-layout
    nav-theme="light"
    :header-render="false"
    :split-menus="false"
    :sider-width="160"
    :menu-header-render="false"
    :menu-data="menuData"
  >
    <p>11111111111111sfnuisdfbui</p>
  </pro-layout>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { getMenuData, clearMenuItem } from '@ant-design-vue/pro-layout'

const router = useRouter()
const { menuData } = getMenuData(clearMenuItem(router.getRoutes()))
</script>
