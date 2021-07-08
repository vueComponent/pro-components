import { createApp } from 'vue';
import router from './router';
import icons from './icons';
import App from './App.vue';
import { ConfigProvider }from 'ant-design-vue';
import ProLayout, { PageContainer } from '../src';

import 'ant-design-vue/es/style';

const app = createApp(App);
app.use(router);
app.use(icons);
app.use(ConfigProvider);
app.use(ProLayout);
app.use(PageContainer);
app.mount('#app');
