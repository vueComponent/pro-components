import '@ant-design-vue/pro-table/style.less';

import { createApp } from 'vue';
import Protable from '@ant-design-vue/pro-table';
import App from './App.vue';
import router from './router';
import icons from './icons';

// functional
import 'ant-design-vue/dist/antd.less';

const app = createApp(App);

app.use(router);

app.use(Protable).use(icons).mount('#app');
