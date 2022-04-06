<template>
  <pro-layout
    v-model:selectedKeys="baseState.selectedKeys"
    v-model:openKeys="baseState.openKeys"
    collapsed
    :loading="loading"
    :breadcrumb="{ routes: breadcrumb }"
    :header-render="false"
    :fix-siderbar="true"
    :collapsed-button-render="false"
    :menu-data="routes"
    disable-content-margin
    style="min-height: 100vh"
    iconfont-url="//at.alicdn.com/t/font_2804900_nzigh7z84gc.js"
  >
    <template #menuHeaderRender>
      <a>
        <img src="/favicon.svg" />
        <h1>Pro Layout</h1>
      </a>
    </template>

    <WaterMark :content="watermarkContent">
      <pro-layout
        v-model:collapsed="baseState.collapsed"
        v-model:selectedKeys="baseState.childrenSelectedKeys"
        v-model:openKeys="baseState.childrenOpenKeys"
        nav-theme="light"
        :menu-header-render="false"
        :menu-data="menuData"
        :fix-siderbar="true"
        :is-children-layout="true"
        disable-content-margin
      >
        <!-- custom right-content -->
        <template #rightContentRender>
          <div style="margin-right: 12px">
            <a-avatar shape="square" size="small">
              <template #icon>
                <UserOutlined />
              </template>
            </a-avatar>
          </div>
        </template>

        <template #headerContentRender>
          <div style="height: 100%; display: flex; align-items: center">
            <a-breadcrumb>
              <a-breadcrumb-item v-for="item of breadcrumb" :key="item.path">
                <router-link :to="{ path: item.path, item: item.params }">
                  {{ item.breadcrumbName }}
                </router-link>
              </a-breadcrumb-item>
            </a-breadcrumb>
          </div>
        </template>

        <!-- content begin -->
        <router-view v-slot="{ Component }">
          <component :is="Component" />
        </router-view>
      </pro-layout>
    </WaterMark>
  </pro-layout>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watchEffect, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Avatar as AAvatar, Breadcrumb as ABreadcrumb, BreadcrumbItem as ABreadcrumbItem } from 'ant-design-vue';
import { getMenuData, clearMenuItem, WaterMark } from '@ant-design-vue/pro-layout';
import type { RouteContextProps } from '@ant-design-vue/pro-layout';

const loading = ref(false);
const watermarkContent = ref('Pro Layout');
const router = useRouter();
const { menuData } = getMenuData(clearMenuItem(router.getRoutes()));

const routes = menuData.map((item) => {
  return {
    ...item,
    children: null,
  };
});

const baseState = reactive<Omit<RouteContextProps, 'menuData'>>({
  selectedKeys: ['/dashboard'],
  openKeys: [],

  childrenSelectedKeys: [],
  childrenOpenKeys: [],
  collapsed: false,
});

const breadcrumb = computed(() =>
  router.currentRoute.value.matched.concat().map((item) => {
    return {
      path: item.path,
      icon: item.meta.icon,
      params: item.meta?.params,
      breadcrumbName: item.meta.title || '',
    };
  })
);

watchEffect(() => {
  if (router.currentRoute) {
    const matched = router.currentRoute.value.matched.concat();
    baseState.childrenSelectedKeys = matched.filter((r) => r.name !== 'index').map((r) => r.path);
    baseState.childrenOpenKeys = matched.filter((r) => r.path !== router.currentRoute.value.path).map((r) => r.path);
  }
});

onMounted(() => {
  setTimeout(() => {
    watermarkContent.value = 'New Mark';
  }, 2000);
});
</script>
