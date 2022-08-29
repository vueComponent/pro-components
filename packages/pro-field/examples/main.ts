import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import icons from './icons';

const app = createApp(App);

app.use(router);

app.use(icons).mount('#app');
