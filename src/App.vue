<script setup lang="ts">
import { VueQueryDevtools } from '@tanstack/vue-query-devtools';
import axios from 'axios';
import { computed, provide } from 'vue';

import AppHeader from '@/components/AppHeader.vue';
import ErrorAlert from '@/components/ErrorAlert.vue';
import MainContainer from '@/components/MainContainer.vue';
import { getConfig } from '@/queries/kalon/module.queries';
import { getConfigValue } from '@/utils/config';
import { moneizClientKey, moneizUrlKey } from '@/utils/moneiz';

import LoadingSpinner from './components/LoadingSpinner.vue';

const {
  isPending: isConfigPending,
  isError: isConfigError,
  isSuccess: isConfigSuccess,
  error: configError,
  data: config,
} = getConfig();

const moneizUrl = computed(() => getConfigValue(config, 'MONEIZ_URL'));
const moneizClient = computed(() => moneizUrl.value ? axios.create({ baseURL: moneizUrl.value }) : undefined);
provide(moneizUrlKey, moneizUrl);
provide(moneizClientKey, moneizClient);
</script>

<template>
  <AppHeader />
  <RouterView v-if="isConfigSuccess" />
  <MainContainer v-else>
    <LoadingSpinner v-if="isConfigPending" />
    <ErrorAlert v-else-if="isConfigError" :message="configError?.message" />
  </MainContainer>

  <VueQueryDevtools />
</template>
