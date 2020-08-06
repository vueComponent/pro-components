import './core/polyfills' // with polyfills

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import i18n from './locales'

import './router/router-guards'
import './core/library'
import ProLayout, { PageHeaderWrapper, SettingDrawer } from '@ant-design-vue/pro-layout'
import initializer from './core/bootstrap'
import './global.less'
import themePluginConfig from '@config/themePluginConfig'

Vue.config.productionTip = false

Vue.use(ProLayout)
Vue.use(PageHeaderWrapper)
Vue.use(SettingDrawer)

window.umi_plugin_ant_themeVar = themePluginConfig.theme

window._vue = new Vue({
  router,
  store,
  i18n,
  beforeCreate: initializer,
  render: h => h(App)
}).$mount('#app')
