<script setup lang="ts">
import { VueQueryDevtools } from '@tanstack/vue-query-devtools';
import { storeToRefs } from 'pinia';

import AppHeader from '@/components/AppHeader.vue';
import ErrorAlert from '@/components/ErrorAlert.vue';
import MainContainer from '@/components/MainContainer.vue';
import { isRouterNavigating } from '@/router';
import { useConfigStore } from '@/stores/config.store';

import LoadingSpinner from './components/LoadingSpinner.vue';

const configStore = useConfigStore();
const {
  isConfigPending,
  isConfigError,
  isConfigSuccess,
  configError,
} = storeToRefs(configStore);
</script>

<template>
  <AppHeader />
  <RouterView v-if="isConfigSuccess && !isRouterNavigating" />
  <MainContainer v-else>
    <LoadingSpinner v-if="isConfigPending || isRouterNavigating" />
    <ErrorAlert v-else-if="isConfigError" :message="configError?.message" />
  </MainContainer>

  <VueQueryDevtools />
</template>
