<script setup lang="ts">
import useVuelidate from '@vuelidate/core';
import BiArrowLeftShort from 'bootstrap-icons/icons/arrow-left-short.svg?component';
import BiArrowRightShort from 'bootstrap-icons/icons/arrow-right-short.svg?component';
import { reactive, ref } from 'vue';

import AppCard from '@/components/AppCard.vue';
import MainContainer from '@/components/MainContainer.vue';
import SmallSpinner from '@/components/SmallSpinner.vue';
import { between, integer, required } from '@/utils/validators';

const maxPresale = ref<number>(8);

const form = reactive({
  companyName: '',
  companyExecutive: '',
  presale: 0,
});

const rules = {
  companyName: { required },
  companyExecutive: { required },
  presale: {
    required,
    between: between(0, maxPresale),
    integer,
  },
};

const v$ = useVuelidate(rules, form, { $scope: false });

const handleSubmit = async () => {
  if (!await v$.value.$validate()) {
  }
};
</script>

<template>
  <MainContainer>
    <h1 class="mb-4">Convention de sponsoring</h1>
    <form @submit.prevent="handleSubmit" novalidate>
      <AppCard class="mb-4">
        <div class="card-text" style="line-height: 2.5rem;">
          Par la présente convention, établie entre l'association BreizhCamp, et
          la société
          <div class="position-relative d-inline-block">
            <input
              type="text"
              class="form-control form-control-sm d-inline-block"
              :class="{ 'is-invalid': v$.companyName.$error }"
              style="width: 420px;"
              v-model="form.companyName"
              @blur="v$.companyName.$touch"
              placeholder="Ma société"
              aria-describedby="company-name-error"
              :aria-invalid="v$.companyName.$error"
            />
            <div
              v-if="v$.companyName.$error"
              id="company-name-error"
              class="invalid-tooltip"
            >
              <p
                v-for="error in v$.companyName.$errors"
                :key="error.$uid"
                class="mb-0"
              >
                {{ error.$message }}
              </p>
            </div>
          </div>
          représentée par
          <div class="position-relative d-inline-block">
            <input
              type="text"
              class="form-control form-control-sm d-inline-block"
              :class="{ 'is-invalid': v$.companyExecutive.$error }"
              style="width: 420px;"
              v-model="form.companyExecutive"
              @blur="v$.companyExecutive.$touch"
              placeholder="Prénom NOM"
              aria-describedby="company-executive-error"
              :aria-invalid="v$.companyExecutive.$error"
            />
            <div
              v-if="v$.companyExecutive.$error"
              id="company-executive-error"
              class="invalid-tooltip"
            >
              <p
                v-for="error in v$.companyExecutive.$errors"
                :key="error.$uid"
                class="mb-0"
              >
                {{ error.$message }}
              </p>
            </div>
          </div>
          , il est convenu que la société
          <input
            type="text"
            class="form-control form-control-sm d-inline-block"
            :class="{ 'is-invalid': v$.companyName.$error }"
            style="width: 420px;"
            v-model="form.companyName"
            @blur="v$.companyName.$touch"
            placeholder="Ma société"
            :aria-invalid="v$.companyName.$error"
          />
          contribue financièrement (sponsoring) à l'organisation du BreizhCamp à
          concurrence de :
        </div>
        <div class="row">
          <div class="col-12 col-lg-6 text-center">
            5000 € sponsor <span class="fw-bold">Platinium</span>
          </div>
          <div class="col-12 col-lg-6 text-center">
            + places en préventes ({{ maxPresale }} max):
            <div class="position-relative d-inline-block">
              <input
                type="number"
                class="form-control form-control-sm d-inline-block"
                :class="{ 'is-invalid': v$.presale.$error }"
                style="width: 100px;"
                v-model="form.presale"
                @blur="v$.presale.$touch"
                min="0"
                :max="maxPresale"
                step="1"
                aria-describedby="presale-error"
                :aria-invalid="v$.presale.$error"
              />
              <div
                v-if="v$.presale.$error"
                id="presale-error"
                class="invalid-tooltip"
              >
                <p
                  v-for="error in v$.presale.$errors"
                  :key="error.$uid"
                  class="mb-0"
                >
                  {{ error.$message }}
                </p>
              </div>
            </div>
            x 100 €
          </div>
        </div>
      </AppCard>

      <div class="d-flex justify-content-between">
        <RouterLink class="btn btn-secondary" :to="{ name: 'sponsorInformations' }">
          <BiArrowLeftShort class="me-2" />
          Modifier
        </RouterLink>

        <button class="btn btn-primary" type="submit">
          <SmallSpinner v-if="false" class="me-2" />
          <BiArrowRightShort v-else class="me-2" />
          Suivant
        </button>
      </div>
    </form>
  </MainContainer>
</template>
