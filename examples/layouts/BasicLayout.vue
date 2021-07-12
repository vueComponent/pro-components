<template>
  <pro-layout
    v-model:collapsed="baseState.collapsed"
    v-model:selectedKeys="baseState.selectedKeys"
    v-model:openKeys="baseState.openKeys"
    v-bind="state"
  >
    <template #collapsedButtonRender>
      <a-button>abc</a-button>
    </template>
    <!-- custom right-content -->
    <template #rightContentRender>
      <span style="color: #0f0">right</span>
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
import { defineComponent, reactive, watchEffect } from 'vue';
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
      navTheme: 'light',
      layout: 'mix',
    });

    watchEffect(() => {
      if (router.currentRoute) {
        baseState.selectedKeys = router.currentRoute.value.matched.concat().map(r => r.path);
      }
    });
    return {
      i18n,
      baseState,
      state,
    };
  },
});
</script>
