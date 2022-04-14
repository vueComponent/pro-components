<template>
  <pro-layout
    :menus="menus"
    :collapsed="collapsed"
    :mediaQuery="query"
    :isMobile="isMobile"
    :handleMediaQuery="handleMediaQuery"
    :handleCollapse="handleCollapse"
    :i18nRender="i18nRender"
    :siderWidth="208"
    v-bind="settings"
  >
    <!--
    <template v-slot:menuRender>
      <ul style="color: white;">
        <li v-for="(menu, key) in menus" :key="key">
          {{ menu.meta.title }}
        </li>
      </ul>
    </template>
    -->
    <template v-slot:menuHeaderRender>
      <div>
        <img src="../assets/logo.svg" />
        <h1>Pro Preview</h1>
      </div>
    </template>
    <template v-slot:headerContentRender>
      <div>
        <a-tooltip title="刷新页面">
          <a-icon type="reload" style="font-size: 18px;cursor: pointer;" @click="() => { $message.info('假的') }" />
        </a-tooltip>
      </div>
    </template>
    <template v-slot:rightContentRender>
      <div :class="['ant-pro-global-header-index-right', settings.layout === 'topmenu' && `ant-pro-global-header-index-${settings.theme}`]">
        rightContentRender
      </div>
    </template>
    <template v-slot:footerRender>
      <div>footerRender</div>
    </template>
    <setting-drawer
      :settings="settings"
      @change="handleSettingChange"
    >
      <div style="margin: 12px 0;">
        This is SettingDrawer custom footer content.
      </div>
    </setting-drawer>
    <WaterMark content="Sendya <18x@loacg.com>">
      <router-view />
    </WaterMark>
  </pro-layout>
</template>

<script>
import { WaterMark, updateTheme } from '@ant-design-vue/pro-layout'
import { asyncRouterMap } from '../config/router.config'
import { i18nRender } from '../locales'

import defaultSettings from '@/config/defaultSettings'
import { CONTENT_WIDTH_TYPE } from '@/store/mutation-types'

export default {
  name: 'BasicLayout',
  components: {
    WaterMark
  },
  data () {
    return {
      // base
      menus: [],
      // 侧栏收起状态
      collapsed: false,
      // 选中的菜单项
      selectedKeys: [],
      // 打开的菜单项
      openKeys: [],

      // 自动隐藏头部栏
      autoHideHeader: false,
      // 媒体查询
      query: {},
      // 布局类型
      layout: 'sidemenu', // 'sidemenu', 'topmenu'
      // 定宽: true / 流式: false
      contentWidth: false, // layout of content: `Fluid` or `Fixed`, only works when layout is topmenu
      // 主题 'dark' | 'light'
      theme: 'dark',
      // 是否手机模式
      isMobile: false,
      settings: {
        // 布局类型
        layout: defaultSettings.layout, // 'sidemenu', 'topmenu'
        // CONTENT_WIDTH_TYPE
        contentWidth: defaultSettings.contentWidth,
        // 主题 'dark' | 'light'
        theme: defaultSettings.navTheme,
        // 主色调
        primaryColor: defaultSettings.primaryColor,
        fixedHeader: defaultSettings.fixedHeader,
        fixSiderbar: defaultSettings.fixSiderbar,
        colorWeak: defaultSettings.colorWeak,

        hideHintAlert: false,
        hideCopyButton: false
      }
    }
  },
  created () {
    this.menus = asyncRouterMap.find(item => item.path === '/').children

    // first created, init theme...
    updateTheme(defaultSettings.primaryColor)

    this.$watch('$route', () => {
      this.handleRouteUpdate()
    })
  },
  mounted () {
    // this.handleRouteUpdate()
    this.openKeys = ['/dashboard', '/form']
  },
  methods: {
    i18nRender,
    handleRouteUpdate () {
      const routes = this.$route.matched.concat()
      const { hidden } = this.$route.meta
      if (routes.length >= 3 && hidden) {
        routes.pop()
        this.selectedKeys = [routes[routes.length - 1].path]
      } else {
        this.selectedKeys = [routes.pop().path]
      }

      const openKeys = []
      if (this.layout === 'sidemenu') {
        routes.forEach(item => {
          item.path && openKeys.push(item.path)
        })
      }
      this.openKeys = openKeys
    },
    handleMediaQuery (val) {
      this.query = val
      if (this.isMobile && !val['screen-xs']) {
        this.isMobile = false
        return
      }
      if (!this.isMobile && val['screen-xs']) {
        this.isMobile = true
        this.collapsed = false
      }
    },
    handleCollapse (val) {
      this.collapsed = val
    },
    handleSelect (selectedKeys) {
      console.log('handleSelect', selectedKeys)
      this.selectedKeys = selectedKeys
    },
    handleOpenChange (openKeys) {
      console.log('handleOpenChange', openKeys)
      this.openKeys = openKeys
    },
    handleSettingChange ({ type, value }) {
      console.log('type', type, value)
      type && (this.settings[type] = value)
      switch (type) {
        case 'contentWidth':
          this.settings[type] = value
          break
        case 'layout':
          if (value === 'sidemenu') {
            this.settings.contentWidth = CONTENT_WIDTH_TYPE.Fluid
          } else {
            this.settings.fixSiderbar = false
            this.settings.contentWidth = CONTENT_WIDTH_TYPE.Fixed
          }
          break
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import "BasicLayout.less";
</style>
