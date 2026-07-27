<script setup lang="ts">
import useVuelidate from '@vuelidate/core';
import BiSend from 'bootstrap-icons/icons/send.svg?component';
import { computed, reactive } from 'vue';
import { useRouter } from 'vue-router';

import AppCard from '@/components/AppCard.vue';
import CardSeparator from '@/components/CardSeparator.vue';
import ErrorAlert from '@/components/ErrorAlert.vue';
import MainContainer from '@/components/MainContainer.vue';
import SmallSpinner from '@/components/SmallSpinner.vue';
import TextField from '@/components/TextField.vue';
import { listSponsoringLevels } from '@/queries/moneiz/levels.queries';
import {
  useCreateSponsorApplicationMutation,
} from '@/queries/moneiz/sponsor-applications.queries';
import { email, maxLength, required } from '@/utils/validators';

const DONT_WANT_TO_BE_SPONSOR_VALUE = 'DONT_WANT_TO_BE_SPONSOR';

const router = useRouter();

const {
  isPending: isSponsoringLevelsPending,
  isError: isSponsoringLevelsError,
  error: sponsoringLevelsError,
  data: levels,
} = listSponsoringLevels();

const sponsorApplyMutation = useCreateSponsorApplicationMutation();

const submitting = computed<boolean>(() => sponsorApplyMutation.isPending.value);
const disabled = computed(() => {
  return isSponsoringLevelsPending.value || submitting.value;
});

const form = reactive({
  companyName: '',
  contact: {
    firstname: '',
    lastname: '',
    email: '',
  },
  sponsoringLevel: '',
  additionalInformations: '',
});

const rules = {
  companyName: {
    required,
    maxLength: maxLength(255),
  },
  contact: {
    firstname: { maxLength: maxLength(255) },
    lastname: {
      required,
      maxLength: maxLength(255),
    },
    email: { required, email },
  },
  sponsoringLevel: { required },
};

const v$ = useVuelidate(rules, form, { $scope: false });

const handleSubmit = async () => {
  if (!await v$.value.$validate()) return;

  await sponsorApplyMutation.mutateAsync({
    companyName: form.companyName.trim(),
    contact: {
      firstname: form.contact.firstname.trim() || undefined,
      lastname: form.contact.lastname.trim(),
      email: form.contact.email.trim(),
    },
    sponsoringLevel: form.sponsoringLevel === DONT_WANT_TO_BE_SPONSOR_VALUE
      ? undefined
      : form.sponsoringLevel,
    additionalInformations: form.additionalInformations.trim() || undefined,
  });

  await router.push({ name: 'sponsorApplicationSent' });
};
</script>

<template>
  <MainContainer>
    <h1 class="mb-4">
      Candidature sponsor BreizhCamp
    </h1>
    <ErrorAlert
      v-if="isSponsoringLevelsError"
      :message="sponsoringLevelsError?.message"
    />
    <form v-else @submit.prevent="handleSubmit" novalidate>
      <ErrorAlert
        v-if="sponsorApplyMutation.isError.value"
        :message="sponsorApplyMutation.error.value?.message"
      />
      <AppCard class="mb-4">
        <h5 class="fw-normal mb-3">Votre société</h5>
        <TextField
          id="company-name"
          label="Nom de votre société"
          v-model="form.companyName"
          @blur="v$.companyName.$touch"
          placeholder="Nom"
          :errors="v$.companyName.$errors"
          :disabled="disabled"
          required
        />
        <CardSeparator />
        <h5 class="fw-normal mb-3">Contacts</h5>
        <TextField
          id="contact-firstname"
          label="Prénom"
          class="mb-3"
          v-model="form.contact.firstname"
          @blur="v$.contact.firstname.$touch"
          placeholder="John"
          :errors="v$.contact.firstname.$errors"
          :disabled="disabled"
        />
        <TextField
          id="contact-lastname"
          label="Nom"
          class="mb-3"
          v-model="form.contact.lastname"
          @blur="v$.contact.lastname.$touch"
          placeholder="Doe"
          :errors="v$.contact.lastname.$errors"
          :disabled="disabled"
          required
        />
        <TextField
          id="contact-email"
          label="Email"
          type="email"
          v-model="form.contact.email"
          @blur="v$.contact.email.$touch"
          placeholder="john.doe@example.com"
          :errors="v$.contact.email.$errors"
          :disabled="disabled"
          required
        />
        <CardSeparator />
        <h5 class="fw-normal mb-3">Niveau de sponsoring</h5>
        <p id="sponsoring-level-description" class="mb-3 text-muted">
          Merci d'indiquer le niveau de sponsoring que vous souhaitez. Si
          jamais le niveau n'était pas disponible, nous reviendrons vers vous
          pour vous proposer un niveau inférieur.
        </p>
        <div class="form-floating has-validation">
          <select
            class="form-select"
            :class="{ 'is-invalid': v$.sponsoringLevel.$error }"
            id="sponsoring-level"
            v-model="form.sponsoringLevel"
            @blur="v$.sponsoringLevel.$touch"
            aria-describedby="sponsoring-level-description sponsoring-level-error"
            :aria-invalid="v$.sponsoringLevel.$error"
            :disabled="disabled"
            required
          >
            <option value="" disabled>
              Choisissez un niveau de sponsoring
            </option>
            <hr />
            <option
              v-for="level in levels"
              :value="level.name"
              :key="level.name"
            >
              {{ level.name }}
            </option>
            <hr />
            <option :value="DONT_WANT_TO_BE_SPONSOR_VALUE">
              Nous ne souhaitons pas sponsorisez cette année
            </option>
          </select>
          <label for="sponsoring-level">
            Niveau de sponsoring
            <span class="text-danger">*</span>
        </label>
        <div id="sponsoring-level-error" class="invalid-feedback">
          <p
            v-for="error of v$.sponsoringLevel.$errors"
            :key="error.$uid"
            class="mb-0"
          >
            {{ error.$message }}
          </p>
        </div>
        </div>
        <CardSeparator />
        <h5 id="additional-informations-title" class="fw-normal mb-3">
          Vous avez une information supplémentaire ?
        </h5>
        <div class="form-floating">
          <textarea
            class="form-control"
            placeholder="Information supplémentaires"
            id="additional-informations"
            v-model="form.additionalInformations"
            :disabled="disabled"
            aria-describedby="additional-informations-title"
          ></textarea>
          <label for="additional-informations">
            Information supplémentaires
          </label>
        </div>
      </AppCard>

      <div class="d-flex justify-content-end">
        <button
          class="btn btn-primary"
          type="submit"
          :disabled="disabled"
        >
          <SmallSpinner v-if="submitting" class="me-2" />
          <BiSend v-else class="me-2" />
          Envoyer
        </button>
      </div>
    </form>
  </MainContainer>
</template>
