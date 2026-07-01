<script setup lang="ts">
import AppCard from '@/components/AppCard.vue';
import MainContainer from '@/components/MainContainer.vue';
</script>

<template>
  <MainContainer class="d-flex justify-content-center">
    <AppCard>
      <div class="text-center">
        <h1 class="display-1 fw-bold text-primary">404</h1>
        <h2 class="mb-3">Page introuvable</h2>
        <p class="text-muted">
          La page que vous recherchez n’existe pas ou a été déplacée.
        </p>
      </div>
    </AppCard>
  </MainContainer>
</template>
