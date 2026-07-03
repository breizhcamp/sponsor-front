<script lang="ts" setup>
import useVuelidate from '@vuelidate/core';
import { helpers } from '@vuelidate/validators';
import { reactive, ref } from 'vue';

import AppModal from '@/components/AppModal.vue';
import { ContactType, contactTypeToString } from '@/dto/moneiz/ContactType';
import type { SponsorInformationsContactReq } from '@/dto/moneiz/SponsorInformationsReq';
import { email, maxLength, required } from '@/utils/validators';

withDefaults(defineProps<{
  edit?: boolean;
}>(), { edit: false });

const emit = defineEmits<{
  save: [contact: SponsorInformationsContactReq];
}>();

const modal = ref<InstanceType<typeof AppModal>>();

const form = reactive<{ contact: SponsorInformationsContactReq }>({
  contact: {
    firstname: '',
    lastname: '',
    email: '',
    type: [],
  },
});

const rules = {
  contact: {
    firstname: { maxLength: maxLength(255) },
    lastname: {
      required,
      maxLength: maxLength(255),
    },
    email: { required, email },
    type: {
      minLength: helpers.withMessage(
        'Vous devez sélectionner au moins un type de message',
        () => form.contact.type.length > 0,
      ),
    },
  },
};

const v$ = useVuelidate(rules, form);

const handleTypeChange = (event: InputEvent, contactType: ContactType) => {
  v$.value.contact.type.$touch();
  const { checked } = event.target as HTMLInputElement;
  if (checked) {
    form.contact.type = [...form.contact.type, contactType];
  } else {
    form.contact.type = form.contact.type.filter(type => type !== contactType);
  }
  console.log(JSON.stringify(form.contact.type));
};

const handleClick = async () => {
  if (!await v$.value.$validate()) return;

  const { firstname, lastname, email, type } = form.contact;
  emit('save', {
    firstname: firstname?.trim() || undefined,
    lastname: lastname.trim(),
    email: email.trim(),
    type: [...type],
  });

  modal.value?.close();
};

const show = (contact?: SponsorInformationsContactReq) => {
  if (contact !== undefined) {
    const { firstname, lastname, email, type } = contact;
    form.contact = {
      firstname,
      lastname,
      email,
      type: [...type],
    };
  } else {
    form.contact = {
      firstname: '',
      lastname: '',
      email: '',
      type: [],
    };
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
    <div class="form-floating has-validation mb-3">
      <input
        type="text"
        class="form-control"
        :class="{ 'is-invalid': v$.contact.firstname.$error }"
        id="firstname"
        v-model="form.contact.firstname"
        @blur="v$.contact.firstname.$touch"
        placeholder="John"
        aria-describedby="firstname-error"
        :aria-invalid="v$.contact.firstname.$error"
      >
      <label for="firstname">Prénom</label>
      <div id="firstname-error" class="invalid-feedback">
        <p
          v-for="error of v$.contact.firstname.$errors"
          :key="error.$uid"
          class="mb-0"
        >
          {{ error.$message }}
        </p>
      </div>
    </div>

    <div class="form-floating has-validation mb-3">
      <input
        type="text"
        class="form-control"
        :class="{ 'is-invalid': v$.contact.lastname.$error }"
        id="lastname"
        v-model="form.contact.lastname"
        @blur="v$.contact.lastname.$touch"
        placeholder="Doe"
        aria-describedby="lastname-error"
        :aria-invalid="v$.contact.lastname.$error"
        required
      >
      <label for="lastname">
        Nom
        <span class="text-danger">*</span>
      </label>
      <div id="lastname-error" class="invalid-feedback">
        <p
          v-for="error of v$.contact.lastname.$errors"
          :key="error.$uid"
          class="mb-0"
        >
          {{ error.$message }}
        </p>
      </div>
    </div>

    <div class="form-floating has-validation mb-3">
      <input
        type="email"
        class="form-control"
        :class="{ 'is-invalid': v$.contact.email.$error }"
        id="email"
        v-model="form.contact.email"
        @blur="v$.contact.email.$touch"
        placeholder="john.doe@example.com"
        aria-describedby="email-error"
        :aria-invalid="v$.contact.email.$error"
        required
      >
      <label for="email">
        Email
        <span class="text-danger">*</span>
      </label>
      <div id="email-error" class="invalid-feedback">
        <p
          v-for="error of v$.contact.email.$errors"
          :key="error.$uid"
          class="mb-0"
        >
          {{ error.$message }}
        </p>
      </div>
    </div>

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
          :class="{ 'is-invalid': v$.contact.type.$error }"
          :id="`contact-type-${contactType.toLocaleLowerCase()}`"
          :checked="form.contact.type.includes(contactType)"
          @change="handleTypeChange($event as InputEvent, contactType)"
          :aria-invalid="v$.contact.type.$error"
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
      <div v-if="v$.contact.type.$error" class="text-danger-emphasis">
        <p
          v-for="error of v$.contact.type.$errors"
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
