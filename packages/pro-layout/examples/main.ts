import 'ant-design-vue/dist/antd.less'

import { createApp } from 'vue'
import ProLayout, { PageContainer } from '@ant-design-vue/pro-layout'
import App from './App.vue'
import router from './router'
import icons from './icons'

const app = createApp(App)

app.use(router)

app.use(ProLayout).use(PageContainer).use(icons).mount('#app')
