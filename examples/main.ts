import 'ant-design-vue/es/style';
import { ConfigProvider, Button } from 'ant-design-vue';

import { createApp } from 'vue';
import router from './router';
import icons from './icons';
import App from './App.vue';

import ProLayout, { PageContainer } from '../src'; // '../dist/pro-layout.es';

const app = createApp(App);
app.use(router);
app.use(icons);
app.use(ConfigProvider);
app.use(Button);
app.use(ProLayout);
app.use(PageContainer);
app.mount('#app');
