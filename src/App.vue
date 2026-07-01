<script setup lang="ts">
import { VueQueryDevtools } from '@tanstack/vue-query-devtools';
import type { AxiosInstance } from 'axios';
import axios from 'axios';
import { onMounted, provide, ref } from 'vue';

import AppHeader from '@/components/AppHeader.vue';
import MainContainer from '@/components/MainContainer.vue';
import { getMoneizUrl, moneizClientKey, moneizUrlKey } from '@/utils/moneiz';

import LoadingSpinner from './components/LoadingSpinner.vue';

const loading = ref<boolean>(true);
const moneizUrl = ref<string>();
const moneizClient = ref<AxiosInstance>();
provide(moneizUrlKey, moneizUrl);
provide(moneizClientKey, moneizClient);

onMounted(async () => {
  moneizUrl.value = await getMoneizUrl();
  moneizClient.value = axios.create({
    baseURL: moneizUrl.value,
  });
  loading.value = false;
});
</script>

<template>
  <AppHeader />
  <MainContainer v-if="loading">
    <LoadingSpinner />
  </MainContainer>
  <RouterView v-else />

  <VueQueryDevtools />
</template>
