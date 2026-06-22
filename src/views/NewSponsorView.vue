<script setup lang="ts">
import useVuelidate from '@vuelidate/core';
import { computed, reactive } from 'vue';
import { useRouter } from 'vue-router';

import CardSeparator from '@/components/CardSeparator.vue';
import ErrorAlert from '@/components/ErrorAlert.vue';
import SmallSpinner from '@/components/SmallSpinner.vue';
import type { SponsorApplicationReq } from '@/dto/moneiz/SponsorApplicationReq';
import { listSponsoringLevels } from '@/queries/moneiz/levels.queries';
import { useSponsorApplyMutation } from '@/queries/moneiz/sponsors.queries';
import { email, maxLength, required } from '@/utils/validators';

const router = useRouter();

const {
  isPending: isSponsoringLevelsPending,
  isError: isSponsoringLevelsError,
  error: sponsoringLevelsError,
  data: levels,
} = listSponsoringLevels('2026');

const sponsorApplyMutation = useSponsorApplyMutation();

const submitting = computed<boolean>(() => sponsorApplyMutation.isPending.value);
const disabled = computed(() => {
  return isSponsoringLevelsPending.value || submitting.value;
});

const form = reactive<SponsorApplicationReq>({
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

const v$ = useVuelidate(rules, form);

const handleSubmit = async () => {
  if (!await v$.value.$validate()) return;

  await sponsorApplyMutation.mutateAsync({
    eventId: '2026',
    sponsorApplicationReq: {
      companyName: form.companyName.trim(),
      contact: {
        firstname: form.contact.firstname?.trim() || undefined,
        lastname: form.contact.lastname.trim(),
        email: form.contact.email.trim(),
      },
      sponsoringLevel: form.sponsoringLevel,
      additionalInformations: form.additionalInformations?.trim() || undefined,
    },
  });

  await router.push({ name: 'sponsorApplicationSent' });
};
</script>

<template>
  <main class="container py-5">
    <h1 class="mb-4">
      Candidature sponsor BreizhCamp
    </h1>
    <ErrorAlert
      v-if="isSponsoringLevelsError"
      :message="sponsoringLevelsError?.message"
    />
    <div v-else class="card shadow">
      <div class="card-body">
        <form @submit.prevent="handleSubmit" novalidate>
          <ErrorAlert
            v-if="sponsorApplyMutation.isError.value"
            :message="sponsorApplyMutation.error.value?.message"
          />
          <h5 class="fw-normal mb-3">Votre société</h5>
          <div class="form-floating has-validation">
            <input
              type="text"
              class="form-control"
              :class="{ 'is-invalid': v$.companyName.$error }"
              id="company-name"
              placeholder="Nom"
              v-model="form.companyName"
              @blur="v$.companyName.$touch"
              aria-describedby="company-name-error"
              :aria-invalid="v$.companyName.$error"
              :disabled="disabled"
              required
            >
            <label for="company-name">
              Nom de votre société
              <span class="text-danger">*</span>
            </label>
            <div id="company-name-error" class="invalid-feedback">
              <p v-for="error of v$.companyName.$errors" :key="error.$uid">
                {{ error.$message }}
              </p>
            </div>
          </div>
          <CardSeparator />
          <h5 class="fw-normal mb-3">Contacts</h5>
          <div class="form-floating has-validation mb-3">
            <input
              type="text"
              class="form-control"
              :class="{ 'is-invalid': v$.contact.firstname.$error }"
              id="contact-firstname"
              placeholder="John"
              v-model="form.contact.firstname"
              @blur="v$.contact.firstname.$touch"
              aria-describedby="contact-firstname-error"
              :aria-invalid="v$.contact.firstname.$error"
              :disabled="disabled"
            >
            <label for="contact-firstname">Prénom</label>
            <div id="contact-firstname-error" class="invalid-feedback">
              <p
                v-for="error of v$.contact.firstname.$errors"
                :key="error.$uid"
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
              id="contact-lastname"
              placeholder="Doe"
              v-model="form.contact.lastname"
              @blur="v$.contact.lastname.$touch"
              aria-describedby="contact-lastname-error"
              :aria-invalid="v$.contact.lastname.$error"
              :disabled="disabled"
              required
            >
            <label for="contact-lastname">
              Nom
              <span class="text-danger">*</span>
            </label>
            <div id="contact-lastname-error" class="invalid-feedback">
              <p v-for="error of v$.contact.lastname.$errors" :key="error.$uid">
                {{ error.$message }}
              </p>
            </div>
          </div>
          <div class="form-floating has-validation">
            <input
              type="email"
              class="form-control"
              :class="{ 'is-invalid': v$.contact.email.$error }"
              id="contact-email"
              placeholder="john.doe@example.com"
              v-model="form.contact.email"
              @blur="v$.contact.email.$touch"
              aria-describedby="contact-email-error"
              :aria-invalid="v$.contact.email.$error"
              :disabled="disabled"
              required
            >
            <label for="contact-email">
              Email
              <span class="text-danger">*</span>
            </label>
            <div id="contact-email-error" class="invalid-feedback">
              <p v-for="error of v$.contact.email.$errors" :key="error.$uid">
                {{ error.$message }}
              </p>
            </div>
          </div>
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
              <option
                v-for="level in levels"
                :value="level.name"
                :key="level.name"
              >
                {{ level.name }}
              </option>
            </select>
            <label for="sponsoring-level">
              Niveau de sponsoring
              <span class="text-danger">*</span>
          </label>
          <div id="sponsoring-level-error" class="invalid-feedback">
            <p v-for="error of v$.sponsoringLevel.$errors" :key="error.$uid">
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
          <div class="mt-4 d-flex justify-content-end">
            <button
              class="btn btn-primary"
              type="submit"
              :disabled="disabled"
            >
              <SmallSpinner v-if="submitting" class="me-2" />
              Envoyer
            </button>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>
