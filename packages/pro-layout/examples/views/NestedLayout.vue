<template>
  <pro-layout
    nav-theme="light"
    layout="mix"
    :header-render="false"
    :fix-siderbar="true"
    :split-menus="false"
    :sider-width="160"
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
