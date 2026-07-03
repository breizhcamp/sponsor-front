<script lang="ts" setup>
withDefaults(defineProps<{
  color?: (
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'light'
    | 'dark'
  );
}>(), { color: 'primary' });
</script>

<template>
  <div
    class="badge rounded-pill"
    :class="`text-bg-${color}`"
  >
    <slot />
  </div>
</template>
