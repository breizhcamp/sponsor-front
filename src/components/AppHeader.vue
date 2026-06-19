<script setup lang="ts">
import logoBreizhCampUrl from '@/assets/logo-breizhcamp.svg?url';
</script>

<template>
  <header class="navbar bg-body shadow sticky-top">
    <div class="container d-flex justify-content-start align-items-center">
      <a href="https://www.breizhcamp.org/" class="navbar-brand">
        <img
          :src="logoBreizhCampUrl"
          alt="Logo du BreizhCamp"
          class="d-inline-block align-text-top"
          width="35"
          height="35"
        />
      </a>
      <div class="fs-5">
        Sponsoring BreizhCamp
      </div>
    </div>
  </header>
</template>
