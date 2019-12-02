import Vue from 'vue'
import store from '../store'
import defaultSettings from '@config/defaultSettings'
import {
  APP_LANGUAGE,
  TOGGLE_CONTENT_WIDTH,
  TOGGLE_FIXED_HEADER,
  TOGGLE_FIXED_SIDEBAR, TOGGLE_HIDE_HEADER,
  TOGGLE_LAYOUT, TOGGLE_NAV_THEME, TOGGLE_WEAK
} from '../store/mutation-types'

export default function initializer () {
  console.log('API_URL:', process.env.BASE_URL)

  // store.commit(ACCESS_TOKEN, Vue.ls.get(ACCESS_TOKEN))
  store.commit(TOGGLE_LAYOUT, Vue.ls.get(TOGGLE_LAYOUT, defaultSettings.layout))
  store.commit(TOGGLE_FIXED_HEADER, Vue.ls.get(TOGGLE_FIXED_HEADER, defaultSettings.fixedHeader))
  store.commit(TOGGLE_FIXED_SIDEBAR, Vue.ls.get(TOGGLE_FIXED_SIDEBAR, defaultSettings.fixSiderbar))
  store.commit(TOGGLE_CONTENT_WIDTH, Vue.ls.get(TOGGLE_CONTENT_WIDTH, defaultSettings.contentWidth))
  store.commit(TOGGLE_HIDE_HEADER, Vue.ls.get(TOGGLE_HIDE_HEADER, defaultSettings.autoHideHeader))
  store.commit(TOGGLE_NAV_THEME, Vue.ls.get(TOGGLE_NAV_THEME, defaultSettings.navTheme))
  store.commit(TOGGLE_WEAK, Vue.ls.get(TOGGLE_WEAK, defaultSettings.colorWeak))
  store.dispatch('setLang', Vue.ls.get(APP_LANGUAGE, 'en-US'))
}
