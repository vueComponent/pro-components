import Vue from 'vue'
import {
  SIDEBAR_TYPE,
  TOGGLE_DEVICE,
  TOGGLE_NAV_THEME,
  TOGGLE_LAYOUT,
  TOGGLE_FIXED_HEADER,
  TOGGLE_FIXED_SIDEBAR,
  TOGGLE_CONTENT_WIDTH,
  TOGGLE_HIDE_HEADER,
  TOGGLE_COLOR,
  TOGGLE_WEAK,
  // i18n
  APP_LANGUAGE
} from '../mutation-types'
import { loadLanguageAsync } from '@/locales'

const App = {
  state: {
    sideCollapsed: true,
    device: 'desktop',
    theme: 'dark',
    layout: '',
    contentWidth: '',
    fixedHeader: false,
    fixedSidebar: false,
    autoHideHeader: false,
    color: '',
    weak: false,
    lang: 'en-US'
  },
  mutations: {
    [SIDEBAR_TYPE]: (state, type) => {
      state.sideCollapsed = type
      Vue.ls.set(SIDEBAR_TYPE, type)
    },
    [TOGGLE_DEVICE]: (state, device) => {
      state.device = device
    },
    [TOGGLE_NAV_THEME]: (state, theme) => {
      state.theme = theme
      Vue.ls.set(TOGGLE_NAV_THEME, theme)
    },
    [TOGGLE_LAYOUT]: (state, mode) => {
      state.layout = mode
      Vue.ls.set(TOGGLE_LAYOUT, mode)
    },
    [TOGGLE_FIXED_HEADER]: (state, mode) => {
      state.fixedHeader = mode
      Vue.ls.set(TOGGLE_FIXED_HEADER, mode)
    },
    [TOGGLE_FIXED_SIDEBAR]: (state, mode) => {
      state.fixedSidebar = mode
      Vue.ls.set(TOGGLE_FIXED_SIDEBAR, mode)
    },
    [TOGGLE_CONTENT_WIDTH]: (state, type) => {
      state.contentWidth = type
      Vue.ls.set(TOGGLE_CONTENT_WIDTH, type)
    },
    [TOGGLE_HIDE_HEADER]: (state, type) => {
      state.autoHideHeader = type
      Vue.ls.set(TOGGLE_HIDE_HEADER, type)
    },
    [TOGGLE_COLOR]: (state, color) => {
      state.color = color
      Vue.ls.set(TOGGLE_COLOR, color)
    },
    [TOGGLE_WEAK]: (state, mode) => {
      state.weak = mode
      Vue.ls.set(TOGGLE_WEAK, mode)
    },
    [APP_LANGUAGE]: (state, lang) => {
      console.log('lang', lang)
      state.lang = lang
      Vue.ls.set(APP_LANGUAGE, lang)
    }
  },
  actions: {
    setLang ({ commit }, lang) {
      return new Promise((resolve, reject) => {
        commit(APP_LANGUAGE, lang)
        loadLanguageAsync(lang).then(() => {
          resolve()
        }).catch((e) => {
          reject(e)
        })
      })
    }
  }
}

export default App
