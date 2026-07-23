import '@/assets/styles/main.scss';

import { VueQueryPlugin } from '@tanstack/vue-query';
import { createPinia } from 'pinia';
import { createApp } from 'vue';

import App from '@/App.vue';
import { queryClient } from '@/queries/queryClient';
import router from '@/router';

const pinia = createPinia();

const app = createApp(App);

app.use(VueQueryPlugin, { queryClient });
app.use(pinia);
app.use(router);

app.mount('#app');
