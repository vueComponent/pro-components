import { createApp } from 'vue';
import ProLayout, { PageContainer } from '@ant-design-vue/pro-layout';
import App from './App.vue';
import router from './router';
import icons from './icons';

// functional
import 'ant-design-vue/es/result/style';
import 'ant-design-vue/es/button/style';
import 'ant-design-vue/es/message/style';
import 'ant-design-vue/dist/antd.dark.less';
import '@ant-design-vue/pro-layout/style.less';

const app = createApp(App);

app.use(router);

app.use(ProLayout).use(PageContainer).use(icons).mount('#app');
