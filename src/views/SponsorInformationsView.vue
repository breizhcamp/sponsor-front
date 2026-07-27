<script setup lang="ts">
import useVuelidate from '@vuelidate/core';
import { helpers } from '@vuelidate/validators';
import BiArrowRightShort from 'bootstrap-icons/icons/arrow-right-short.svg?component';
import BiPlusLg from 'bootstrap-icons/icons/plus-lg.svg?component';
import BiTrash from 'bootstrap-icons/icons/trash.svg?component';
import { storeToRefs } from 'pinia';
import { computed, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import AppBadge from '@/components/AppBadge.vue';
import AppCard from '@/components/AppCard.vue';
import CardSeparator from '@/components/CardSeparator.vue';
import ConfirmationModal from '@/components/ConfirmationModal.vue';
import ContactFormModal from '@/components/ContactFormModal.vue';
import ErrorAlert from '@/components/ErrorAlert.vue';
import InfoAlert from '@/components/InfoAlert.vue';
import MainContainer from '@/components/MainContainer.vue';
import SmallSpinner from '@/components/SmallSpinner.vue';
import TextField from '@/components/TextField.vue';
import type { ContactReq } from '@/dto/moneiz/ContactReq';
import { contactTypeToString } from '@/dto/moneiz/ContactType';
import {
  useSponsor,
  useSubmitSponsorInformationsMutation,
  useUploadSponsorLogoMutation,
} from '@/queries/moneiz/sponsors.queries';
import { useConfigStore } from '@/stores/config.store';
import { readFileToUrl } from '@/utils/fileReader';
import { maxLength, required, url } from '@/utils/validators';

const configStore = useConfigStore();
const { moneizUrl } = storeToRefs(configStore);

const router = useRouter();

const {
  isSuccess: isSponsorSucess,
  isError: isSponsorError,
  error: sponsorError,
  data: sponsor,
} = useSponsor();

const submitSponsorInformationsMutation = useSubmitSponsorInformationsMutation();
const uploadSponsorLogoMutation = useUploadSponsorLogoMutation();

const addContactModal = ref<InstanceType<typeof ContactFormModal>>();
const deleteContactConfirmationModal = ref<InstanceType<typeof ConfirmationModal>>();
const contactEditingIndex = ref<number | null>(null);
const contactDeleteIndex = ref<number | null>(null);
const disabled = computed(() => {
  return !isSponsorSucess.value
    || submitSponsorInformationsMutation.isPending.value
    || uploadSponsorLogoMutation.isPending.value;
});
const loading = computed(() => {
  return submitSponsorInformationsMutation.isPending.value
    || uploadSponsorLogoMutation.isPending.value;
});

const form = reactive<{
  name: string;
  url: string;
  logo: File | string | null;
  invoiceName: string;
  address: string;
  contacts: ContactReq[];
}>({
  name: '',
  url: '',
  logo: null,
  invoiceName: '',
  address: '',
  contacts: [],
});

const rules = {
  name: {
    required,
    maxLength: maxLength(255),
  },
  url: {
    required,
    url,
  },
  logo: { required },
  invoiceName: { required },
  address: { required },
  contacts: {
    required: helpers.withMessage(
      'Vous devez renseigner au moins un contact',
      required,
    ),
  },
};

const v$ = useVuelidate(rules, form, { $scope: false });

const logoPreviewUrl = ref<string | null>(null);

watch(() => form.logo, async (logo) => {
  if (logo === null) {
    logoPreviewUrl.value = null;
    return;
  }
  logoPreviewUrl.value = typeof logo === 'string'
    ? logo
    : await readFileToUrl(logo);
});

watch(sponsor, (sponsor) => {
  if (sponsor === undefined) return;

  form.name = sponsor.name;
  form.url = sponsor.url ?? '';
  form.invoiceName = sponsor.invoiceName ?? '';
  form.address = sponsor.address ?? '';
  form.contacts = [...sponsor.contacts];
  if (sponsor.logo && moneizUrl.value) {
    form.logo = `${moneizUrl.value}/sponsors/logo/${sponsor.logo}`;
  }
}, { immediate: true });

const handleLogoChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  form.logo = target.files?.[0] ?? null;
};

const handleEditContactClick = (
  contact: ContactReq,
  index: number,
) => {
  if (disabled.value) return;
  contactEditingIndex.value = index;
  addContactModal.value?.show(contact);
};

const handleContactDeleteClick = (index: number) => {
  contactDeleteIndex.value = index;
  deleteContactConfirmationModal.value?.show();
};

const handleConfirmDeleteContact = () => {
  form.contacts = form.contacts.filter((_, index) => {
    return index !== contactDeleteIndex.value;
  });
  contactDeleteIndex.value = null;
};

const handleAddContactClick = () => {
  contactEditingIndex.value = null;
  addContactModal.value?.show();
};

const handleContactSave = (contact: ContactReq) => {
  if (contactEditingIndex.value === null) {
    form.contacts = [...form.contacts, { ...contact }];
  } else {
    form.contacts[contactEditingIndex.value] = { ...contact };
  }
};

const handleSubmit = async () => {
  if (!await v$.value.$validate()) return;

  await Promise.all([
    submitSponsorInformationsMutation.mutateAsync({
      name: form.name.trim(),
      url: form.url.trim(),
      invoiceName: form.invoiceName.trim(),
      address: form.address.trim(),
      contacts: form.contacts,
    }),
    form.logo instanceof File && uploadSponsorLogoMutation.mutateAsync(
      form.logo,
    ),
  ]);

  await router.push({ name: 'sponsorAgreement' });
};
</script>

<template>
  <MainContainer>
    <ErrorAlert v-if="isSponsorError" :message="sponsorError?.message" />
    <template v-else>
      <InfoAlert>
        <p class="my-0">
          Merci de remplir le formulaire suivant afin d'enregistrer votre
          participation en tant que sponsor du BreizhCamp.
        </p>
        <p class="my-0">
          La convention de sponsoring sera éditée à l'issue du remplissage et
          vous pourrez la signer.
        </p>
      </InfoAlert>
      <form @submit.prevent="handleSubmit" novalidate>
        <AppCard class="mb-4">
          <h5 class="card-title">Informations générales</h5>
          <p class="card-text text-muted">
            Informations communiquées sur notre site web
          </p>

          <div class="row">
            <div class="col-12 col-xl-6 mb-3 mb-xl-0">
              <TextField
                id="name"
                class="mb-3"
                label="Nom de votre société"
                v-model="form.name"
                @blur="v$.name.$touch"
                placeholder="Nom"
                :errors="v$.name.$errors"
                :disabled="disabled"
                required
              />

              <TextField
                id="url"
                label="Adresse site web"
                v-model="form.url"
                @blur="v$.url.$touch"
                placeholder="https://example.com"
                :errors="v$.url.$errors"
                :disabled="disabled"
                required
              />
            </div>

            <div class="col-12 col-xl-6">
              <div class="row">
                <div class="col">
                  <label for="logo" class="form-label">
                    Logo
                    <span class="text-danger">*</span>
                  </label>
                  <input
                    type="file"
                    class="form-control"
                    :class="{ 'is-invalid': v$.logo.$error }"
                    id="logo"
                    @change="handleLogoChange"
                    aria-describedby="logo-description logo-error"
                    :disabled="disabled"
                    required
                  />
                  <p id="logo-description" class="form-text mb-0">
                    Adapté pour fond clair, de préférence au format SVG ou sinon
                    PNG, max. 2 Mo
                  </p>
                  <div id="logo-error" class="invalid-feedback">
                    <p
                      v-for="error of v$.logo.$errors"
                      :key="error.$uid"
                      class="mb-0"
                    >
                      {{ error.$message }}
                    </p>
                  </div>
                </div>
                <div class="col-auto" v-if="logoPreviewUrl">
                  <img
                    :src="logoPreviewUrl"
                    alt="Aperçu du logo"
                    class="img-fluid img-thumbnail bg-white"
                    style="max-height: 100px;"
                  />
                </div>
              </div>
            </div>
          </div>

          <CardSeparator />

          <h5 class="card-title mb-3">Informations de facturation</h5>
          <TextField
            id="invoice-name"
            label="Raison sociale"
            class="mb-3"
            v-model="form.invoiceName"
            @blur="v$.invoiceName.$touch"
            :errors="v$.invoiceName.$errors"
            :disabled="disabled"
            required
          />

          <div class="form-floating has-validation">
            <textarea
              class="form-control"
              :class="{ 'is-invalid': v$.address.$error }"
              style="height: 120px;"
              id="address"
              v-model="form.address"
              @blur="v$.address.$touch"
              placeholder="a"
              aria-describedby="address-error"
              :aria-invalid="v$.address.$error"
              :disabled="disabled"
              required
            ></textarea>
            <label for="address">
              Adresse
              <span class="text-danger">*</span>
            </label>
            <div id="address-error" class="invalid-feedback">
              <p
                v-for="error of v$.address.$errors"
                :key="error.$uid"
                class="mb-0"
              >
                {{ error.$message }}
              </p>
            </div>
          </div>

          <CardSeparator />

          <h5 class="card-title">Contacts</h5>
          <p class="text-muted">
            Vous pouvez ajouter ou modifier des contacts pour faciliter les
            échanges avec l'équipe du BreizhCamp
          </p>

          <div v-if="form.contacts.length" class="list-group mb-3">
            <div
              v-for="contact, index in form.contacts"
              class="list-group-item list-group-item-action cursor-pointer"
              title="Modifier"
              @click="handleEditContactClick(contact, index)"
              tabindex="0"
              :key="contact.email"
            >
              <div class="row align-items-center">
                <div class="col">
                  <div class="row">
                    <div class="col-12 mb-1">
                      <p class="text-body my-0">
                        {{ contact.firstname }}
                        {{ contact.lastname }}
                      </p>
                      <p class="text-muted my-0">{{ contact.email }}</p>
                    </div>
                    <div class="col-12">
                      <div class="d-flex flex-wrap gap-2">
                        <AppBadge
                          v-for="type in contact.type.toSorted()"
                          :key="type"
                        >
                          {{ contactTypeToString[type] }}
                        </AppBadge>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-auto">
                  <button
                    type="button"
                    class="btn btn-outline-danger"
                    title="Supprimer"
                    :disabled="disabled"
                    @click.stop="handleContactDeleteClick(index)"
                  >
                    <BiTrash />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <p
            class="text-danger-emphasis"
            v-for="error of v$.contacts.$errors"
            :key="error.$uid"
          >
            {{ error.$message }}
          </p>

          <div class="d-flex justify-content-end">
            <button
              type="button"
              class="btn btn-primary"
              title="Ajouter un contact"
              @click="handleAddContactClick"
              :disabled="disabled"
            >
              <BiPlusLg class="me-2" />
              Ajouter
            </button>
          </div>
        </AppCard>

        <div class="d-flex justify-content-end">
          <button
            class="btn btn-primary"
            type="submit"
            :disabled="disabled"
          >
            <SmallSpinner v-if="loading" class="me-2" />
            <BiArrowRightShort v-else class="me-2" />
            Suivant
          </button>
        </div>
      </form>
    </template>
  </MainContainer>

  <ContactFormModal
    :edit="contactEditingIndex !== null"
    ref="addContactModal"
    @save="handleContactSave"
  />

  <ConfirmationModal
    name="delete-contact"
    variant="danger"
    @confirm="handleConfirmDeleteContact"
    ref="deleteContactConfirmationModal"
  >
    <p>Êtes-vous sûr ce vouloir supprimer ce contact :</p>
    <div v-if="contactDeleteIndex !== null">
      <p class="fw-bold mb-0">
        {{ form.contacts[contactDeleteIndex].firstname }}
        {{ form.contacts[contactDeleteIndex].lastname }}
      </p>
      <p class="text-muted mb-0">
        {{ form.contacts[contactDeleteIndex].email }}
      </p>
    </div>
  </ConfirmationModal>
</template>
