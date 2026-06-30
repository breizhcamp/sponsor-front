<script setup lang="ts">
import { VueQueryDevtools } from '@tanstack/vue-query-devtools';

import AppHeader from '@/components/AppHeader.vue';
</script>

<template>
  <AppHeader />
  <RouterView />

  <VueQueryDevtools />
</template>
