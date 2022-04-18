<template>
  <pro-layout
    v-model:collapsed="baseState.collapsed"
    v-model:selectedKeys="baseState.selectedKeys"
    v-model:openKeys="baseState.openKeys"
    v-bind="state"
    :loading="loading"
    :breadcrumb="{ routes: breadcrumb }"
    style="min-height: 100vh"
    iconfont-url="//at.alicdn.com/t/font_2804900_nzigh7z84gc.js"
  >
    <template #menuHeaderRender>
      <a>
        <img src="/favicon.svg" />
        <h1>Pro Layout</h1>
      </a>
    </template>

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
    <!-- custom breadcrumb itemRender  -->
    <template #breadcrumbRender="{ route, params, routes }">
      <span v-if="routes.indexOf(route) === routes.length - 1">{{ route.breadcrumbName }}</span>
      <router-link v-else :to="{ path: route.path, params }">
        {{ route.breadcrumbName }}
      </router-link>
    </template>
    <template #menuFooterRender>
      <a
        :style="{
          lineHeight: '48rpx',
          display: 'flex',
          height: '48px',
          alignItems: 'center',
        }"
        href="https://preview.pro.antdv.com/dashboard/analysis"
        target="_blank"
        rel="noreferrer"
      >
        <img
          alt="pro-logo"
          src="https://procomponents.ant.design/favicon.ico"
          :style="{
            width: '16px',
            height: '16px',
            margin: '0 16px',
            marginRight: '10px',
          }"
        />
        <span v-if="!baseState.collapsed">Preview Pro</span>
      </a>
    </template>

    <!-- content begin -->
    <router-view v-slot="{ Component }">
      <!-- <WaterMark :content="watermarkContent"> -->
      <component :is="Component" />
      <!-- </WaterMark> -->
    </router-view>
  </pro-layout>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, watchEffect, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { message, Button, Input, Switch, Select, Avatar, Space, Badge, Menu } from 'ant-design-vue';
import { getMenuData, clearMenuItem, WaterMark, FooterToolbar } from '@ant-design-vue/pro-layout';
import type { RouteContextProps } from '@ant-design-vue/pro-layout';

const i18n = (t: string) => t;

export default defineComponent({
  name: 'BasicLayout',
  components: {
    FooterToolbar,
    WaterMark,

    [Button.name]: Button,
    [Input.name]: Input,
    [Input.Search.name]: Input.Search,
    [Switch.name]: Switch,
    [Select.name]: Select,
    ['a-slect-option']: Select.Option,
    [Space.name]: Space,
    [Badge.name]: Badge,
    [Avatar.name]: Avatar,
    [Menu.Item.name]: Menu.Item,
  },
  setup() {
    const loading = ref(false);
    const watermarkContent = ref('Pro Layout');
    const router = useRouter();
    const { menuData } = getMenuData(clearMenuItem(router.getRoutes()));

    const baseState = reactive<Omit<RouteContextProps, 'menuData'>>({
      selectedKeys: [],
      openKeys: [],
      // default
      collapsed: false,
    });

    const state = reactive({
      menuData,
      splitMenus: false,
      // title: 'ProLayout',
      // logo: 'https://alicdn.antdv.com/v2/assets/logo.1ef800a8.svg',
      navTheme: 'light',
      layout: 'top',
      fixSiderbar: false,
      fixedHeader: true,
    });
    const breadcrumb = computed(() =>
      router.currentRoute.value.matched.concat().map((item) => {
        return {
          path: item.path,
          breadcrumbName: item.meta.title || '',
        };
      })
    );

    const handleCollapsed = () => {
      baseState.collapsed = !baseState.collapsed;
    };
    watchEffect(() => {
      if (router.currentRoute) {
        const matched = router.currentRoute.value.matched.concat();
        baseState.selectedKeys = matched.filter((r) => r.name !== 'index').map((r) => r.path);
        baseState.openKeys = matched.filter((r) => r.path !== router.currentRoute.value.path).map((r) => r.path);
      }
    });

    function handlePageLoadingClick() {
      loading.value = true;
      setTimeout(() => {
        loading.value = false;
      }, 2000);
    }

    onMounted(() => {
      setTimeout(() => {
        watermarkContent.value = 'New Mark';
      }, 2000);
    });

    return {
      i18n,
      watermarkContent,
      baseState,
      state,
      loading,
      breadcrumb,

      handlePageLoadingClick,
      handleCollapsed,
      handleSearch: () => {
        message.info('search..');
      },
    };
  },
});
</script>
