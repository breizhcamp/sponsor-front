<script setup lang="ts">
import type { ErrorObject } from '@vuelidate/core';
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  modelValue: string | undefined;
  id: string;
  label: string;
  type?: 'email' | 'text' | 'url';
  placeholder?: string;
  errors?: ErrorObject[];
  disabled?: boolean;
  required?: boolean;
}>(), {
  type: 'text',
  placeholder: '',
  errors: () => [],
  disabled: false,
  required: false,
});

const invalid = computed<boolean>(() => props.errors.length > 0);

const emit = defineEmits<{
  'blur': [];
  'update:modelValue': [value: string];
}>();

const handleChange = (event: InputEvent) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};
</script>

<template>
  <div class="form-floating has-validation">
    <input
      :type="type"
      :id="id"
      class="form-control"
      :class="{ 'is-invalid': invalid }"
      :value="modelValue"
      @change="handleChange($event as InputEvent)"
      :placeholder="placeholder"
      :aria-describedby="`${id}-error`"
      :aria-invalid="invalid"
      :disabled="disabled"
      @blur="emit('blur')"
    />
    <label :for="id">
      {{ label }}
      <span v-if="required" class="text-danger">*</span>
    </label>
    <div :id="`${id}-error`" class="invalid-feedback">
      <p
        v-for="error of errors"
        :key="error.$uid"
        class="mb-0"
      >
        {{ error.$message }}
      </p>
    </div>
  </div>
</template>
