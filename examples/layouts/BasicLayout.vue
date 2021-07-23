<template>
  <pro-layout
    v-model:collapsed="baseState.collapsed"
    v-model:selectedKeys="baseState.selectedKeys"
    v-model:openKeys="baseState.openKeys"
    v-bind="state"
    :collapsed-button-render="false"
    :breadcrumb="{ routes: breadcrumb }"
  >
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
    <template #breadcrumbRender="{ route, params, routes, paths }">
      <span v-if="routes.indexOf(route) === routes.length - 1">
        {{ route.breadcrumbName }}
      </span>
      <router-link v-else :to="{ path: paths.join('/'), params }">
        {{ route.breadcrumbName }}
      </router-link>
    </template>
    <!-- content begin -->
    <router-view />
    <!-- content end -->
    <FooterToolbar>
      <a-space>
        <span :disabled="state.layout !== 'mix'">
          <span style="margin-right: 8px">SplitMenus:</span>
          <a-switch
            v-model:checked="state.splitMenus"
            :disabled="state.layout !== 'mix'"
            checked-children="ON"
            un-checked-children="OFF"
          />
        </span>
        <a-select v-model:value="state.navTheme" style="width: 100px">
          <a-select-option value="light">Light</a-select-option>
          <a-select-option value="dark">Dark</a-select-option>
        </a-select>
        <a-select v-model:value="state.layout" style="width: 100px">
          <a-select-option value="side">Side</a-select-option>
          <a-select-option value="top">Top</a-select-option>
          <a-select-option value="mix">Mix</a-select-option>
        </a-select>
      </a-space>
    </FooterToolbar>
  </pro-layout>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { Button, Switch, Select, Space } from 'ant-design-vue';
import { getMenuData, clearMenuItem, FooterToolbar } from '@ant-design-vue/pro-layout';
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
  },
  setup() {
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
      title: 'ProLayout',
      logo: 'https://alicdn.antdv.com/v2/assets/logo.1ef800a8.svg',
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
        baseState.selectedKeys = matched.map(r => r.path);
        baseState.openKeys = matched
          .filter(r => r.path !== router.currentRoute.value.path)
          .map(r => r.path);

        console.log('baseState', baseState);
      }
    });
    return {
      i18n,
      baseState,
      state,
      breadcrumb,

      handleCollapsed,
    };
  },
});
</script>
