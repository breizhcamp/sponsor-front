<script setup lang="ts">
import { ref } from 'vue';

import AppModal from '@/components/AppModal.vue';

withDefaults(defineProps<{
  name: string;
  variant?: 'primary' | 'danger';
}>(), { variant: 'primary' });

const modal = ref<InstanceType<typeof AppModal>>();

const show = () => {
  modal.value?.show();
};

const emit = defineEmits<{
  confirm: [];
}>();

const handleYesClick = () => {
  emit('confirm');
  modal.value?.close();
};

const handleNoClick = () => {
  modal.value?.close();
};

defineExpose({
  show,
});
</script>

<template>
  <AppModal :name="name" ref="modal">
    <template #title v-if="$slots.title">
      <slot name="title" />
    </template>

    <slot />

    <template #footer>
      <button
        type="button"
        class="btn btn-secondary"
        @click="handleNoClick()"
      >
        Non
      </button>
      <button
        type="button"
        class="btn"
        :class="`btn-${variant}`"
        @click="handleYesClick()"
      >
        Oui
      </button>
    </template>
  </AppModal>
</template>
