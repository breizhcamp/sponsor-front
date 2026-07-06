<script setup lang="ts">
import BiInfoCircleFill from 'bootstrap-icons/icons/info-circle-fill.svg?component';
</script>

<template>
  <div class="alert alert-info d-flex align-items-center" role="alert">
    <BiInfoCircleFill class="me-3" />
    <div>
      <slot />
    </div>
  </div>
</template>
