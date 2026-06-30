import '@/assets/styles/main.scss';

import { VueQueryPlugin } from '@tanstack/vue-query';
import axios from 'axios';
import { createApp } from 'vue';

import App from '@/App.vue';
import router from '@/router';
import { getMoneizUrl, moneizAxiosKey } from '@/utils/moneiz';

const app = createApp(App);

app.use(router);
app.use(VueQueryPlugin);

app.provide(moneizAxiosKey, axios.create({
  baseURL: await getMoneizUrl(),
}));

app.mount('#app');
