<template>
  <pro-layout
    v-model:collapsed="baseState.collapsed"
    v-model:selectedKeys="baseState.selectedKeys"
    v-model:openKeys="baseState.openKeys"
    v-bind="state"
    :loading="loading"
    :breadcrumb="{ routes: breadcrumb }"
    breakpoint="sm"
  >
    <template #menuHeaderRender>
      <a>
        <img src="/antdv-pro-logo.svg" />
        <h1>Pro Layout</h1>
      </a>
    </template>
    <!-- only work layout `Side` -->
    <template #headerContentRender>
      <a :style="{ margin: '0 8px', fontSize: '20px' }" @click="handleCollapsed">
        <MenuUnfoldOutlined v-if="baseState.collapsed" />
        <MenuFoldOutlined v-else />
      </a>
      <span>some..</span>
    </template>
    <!-- custom right-content -->
    <template #rightContentRender>
      <span style="color: #0f0">right</span>
    </template>
    <!-- custom breadcrumb itemRender  -->
    <template #breadcrumbRender="{ route, params, routes }">
      <span v-if="routes.indexOf(route) === routes.length - 1">
        <SmileOutlined />
        {{ route.breadcrumbName }}
      </span>
      <router-link v-else :to="{ path: route.path, params }">
        <SmileOutlined />
        {{ route.breadcrumbName }}
      </router-link>
    </template>
    <!-- custom menu-item -->
    <template #menuItemRender="{ item, icon }">
      <a-menu-item
        :key="item.path"
        :disabled="item.meta?.disabled"
        :danger="item.meta?.danger"
        :icon="icon"
      >
        <router-link :to="{ path: item.path }">
          <div class="a-menu-item-title">
            <a-badge count="5" dot>{{ item.meta.title }}</a-badge>
          </div>
        </router-link>
      </a-menu-item>
    </template>
    <!-- content begin -->
    <router-view />
    <!-- content end -->
    <template #footerRender>
      <GlobalFooter
        :links="[
          { key: 'a link', title: 'Link1', href: 'http://www.baidu.com/', blankTarget: true },
          { key: 'b link', title: 'Link2', href: 'https://www.google.com/', blankTarget: true },
        ]"
        copyright="2021 &copy; Sendya"
      ></GlobalFooter>
    </template>
  </pro-layout>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { Button, Switch, Select, Space, Badge, Menu } from 'ant-design-vue';
import {
  getMenuData,
  clearMenuItem,
  FooterToolbar,
  GlobalFooter,
} from '@ant-design-vue/pro-layout';
import { SmileOutlined } from '@ant-design/icons-vue';
import type { RouteContextProps } from '@ant-design-vue/pro-layout';

const i18n = (t: string) => t;

export default defineComponent({
  name: 'BasicLayout',
  components: {
    FooterToolbar,
    [Button.name]: Button,
    [Switch.name]: Switch,
    [Select.name]: Select,
    [Select.Option.displayName!]: Select.Option,
    [Space.name]: Space,

    [Badge.name]: Badge,
    [Menu.Item.name]: Menu.Item,

    GlobalFooter,
    SmileOutlined,
  },
  setup() {
    const loading = ref(false);

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
      navTheme: 'dark',
      layout: 'mix',
    });
    const breadcrumb = computed(() =>
      router.currentRoute.value.matched.concat().map(item => {
        return {
          path: item.path,
          breadcrumbName: item.meta.title || '',
        };
      }),
    );

    const handleCollapsed = () => {
      baseState.collapsed = !baseState.collapsed;
    };
    watchEffect(() => {
      if (router.currentRoute) {
        const matched = router.currentRoute.value.matched.concat();
        baseState.selectedKeys = matched.filter(r => r.name !== 'index').map(r => r.path);
        baseState.openKeys = matched
          .filter(r => r.path !== router.currentRoute.value.path)
          .map(r => r.path);
      }
    });

    function handlePageLoadingClick() {
      loading.value = true;
      setTimeout(() => {
        loading.value = false;
      }, 2000);
    }

    return {
      i18n,
      baseState,
      state,
      loading,
      breadcrumb,

      handlePageLoadingClick,
      handleCollapsed,
    };
  },
});
</script>
