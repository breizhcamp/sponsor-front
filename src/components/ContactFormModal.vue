<script lang="ts" setup>
import useVuelidate from '@vuelidate/core';
import { helpers } from '@vuelidate/validators';
import { reactive, ref } from 'vue';

import AppModal from '@/components/AppModal.vue';
import TextField from '@/components/TextField.vue';
import type { ContactId } from '@/dto/moneiz/ContactId';
import type { ContactReq } from '@/dto/moneiz/ContactReq';
import { ContactType, contactTypeToString } from '@/dto/moneiz/ContactType';
import { email, maxLength, required } from '@/utils/validators';

withDefaults(defineProps<{
  edit?: boolean;
}>(), { edit: false });

const emit = defineEmits<{
  save: [contact: ContactReq];
}>();

const modal = ref<InstanceType<typeof AppModal>>();
const contactId = ref<ContactId>();

const form = reactive<{
  firstname: string;
  lastname: string;
  email: string;
  type: ContactType[];
}>({
  firstname: '',
  lastname: '',
  email: '',
  type: [],
});

const rules = {
  firstname: { maxLength: maxLength(255) },
  lastname: {
    required,
    maxLength: maxLength(255),
  },
  email: { required, email },
  type: {
    minLength: helpers.withMessage(
      'Vous devez sélectionner au moins un type de message',
      () => form.type.length > 0,
    ),
  },
};

const v$ = useVuelidate(rules, form, { $scope: false });

const handleTypeChange = (event: InputEvent, contactType: ContactType) => {
  v$.value.type.$touch();
  const { checked } = event.target as HTMLInputElement;
  if (checked) {
    form.type = [...form.type, contactType];
  } else {
    form.type = form.type.filter(type => type !== contactType);
  }
};

const handleClick = async () => {
  if (!await v$.value.$validate()) return;

  const { firstname, lastname, email, type } = form;
  emit('save', {
    id: contactId.value,
    firstname: firstname.trim() || undefined,
    lastname: lastname.trim(),
    email: email.trim(),
    type: [...type],
  });

  modal.value?.close();
};

const show = (contact?: ContactReq) => {
  if (contact !== undefined) {
    const { id, firstname, lastname, email, type } = contact;
    contactId.value = id;
    form.firstname = firstname ?? '';
    form.lastname = lastname;
    form.email = email;
    form.type = [...type];
  } else {
    contactId.value = undefined;
    form.firstname = '';
    form.lastname = '';
    form.email = '';
    form.type = [];
  }
  v$.value.$reset();
  modal.value?.show();
};

defineExpose({
  show,
});
</script>

<template>
  <AppModal name="contact-form" ref="modal">
    <template #title>
      {{ edit ? 'Édition' : 'Ajout' }} d'un contact
    </template>

    <TextField
      id="firstname"
      class="mb-3"
      label="Prénom"
      v-model="form.firstname"
      @blur="v$.firstname.$touch"
      placeholder="John"
      :errors="v$.firstname.$errors"
    />

    <TextField
      id="lastname"
      class="mb-3"
      label="Nom"
      v-model="form.lastname"
      @blur="v$.lastname.$touch"
      placeholder="Doe"
      :errors="v$.lastname.$errors"
      required
    />

    <TextField
        id="email"
        class="mb-3"
        label="Email"
        type="email"
        v-model="form.email"
        @blur="v$.email.$touch"
        placeholder="john.doe@example.com"
        :errors="v$.email.$errors"
        required
    />

    <div>
      <label for="">
        Type de message
      </label>
      <div class="form-text mb-2">
        Nous permet de choisir quelle personne contacter selon le sujet de
        l'email.
      </div>
      <div
        v-for="contactType in ContactType"
        class="form-check"
        :key="contactType"
      >
        <input
          type="checkbox"
          class="form-check-input"
          :class="{ 'is-invalid': v$.type.$error }"
          :id="`contact-type-${contactType.toLocaleLowerCase()}`"
          :checked="form.type.includes(contactType)"
          @change="handleTypeChange($event as InputEvent, contactType)"
          :aria-invalid="v$.type.$error"
        >
        <label
          class="form-check-label"
          style="user-select: none;"
          :for="`contact-type-${contactType.toLocaleLowerCase()}`"
        >
          {{ contactTypeToString[contactType] }}
          <template v-if="contactType === ContactType.PRINCIPAL">
            <span class="text-muted">(reçois tous les e-mails)</span>
          </template>
        </label>
      </div>
      <div v-if="v$.type.$error" class="text-danger-emphasis">
        <p
          v-for="error of v$.type.$errors"
          :key="error.$uid"
          class="my-0"
        >
          {{ error.$message }}
        </p>
      </div>
    </div>

    <template #footer>
      <button
        type="button"
        class="btn btn-primary"
        @click="handleClick"
      >
        {{ edit ? 'Enregistrer' : 'Ajouter' }}
      </button>
    </template>
  </AppModal>
</template>
