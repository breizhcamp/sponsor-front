import { defineStore } from 'pinia';
import { computed, type Ref } from 'vue';

import type { ModuleConfiApi } from '@/dto/kalon/ModuleConfigApi';
import { useConfig } from '@/queries/kalon/module.queries';
import { createMoneizClient } from '@/utils/moneiz';

const getConfigValue = (
  config: Ref<ModuleConfiApi[] | undefined>,
  key: string,
): string | undefined => {
  if (config.value === undefined) return undefined;
  return config.value.find(entry => entry.key === key)?.value;
};

export const useConfigStore = defineStore('config', () => {
  const {
    isPending: isConfigPending,
    isError: isConfigError,
    isSuccess: isConfigSuccess,
    error: configError,
    data: config,
  } = useConfig();

  const moneizUrl = computed(
    () => getConfigValue(config, 'MONEIZ_URL'),
  );
  const defaultEventId = computed(
    () => getConfigValue(config, 'DEFAULT_EVENT_ID'),
  );
  const keycloakUrl = computed(
    () => getConfigValue(config, 'KEYCLOAK_URL'),
  );
  const keycloakRealm = computed(
    () => getConfigValue(config, 'KEYCLOAK_REALM'),
  );
  const keycloakClientId = computed(
    () => getConfigValue(config, 'KEYCLOAK_CLIENT_ID'),
  );

  const moneizClient = computed(
    () => moneizUrl.value ? createMoneizClient(moneizUrl.value) : undefined,
  );

  return {
    isConfigPending,
    isConfigError,
    isConfigSuccess,
    configError,

    moneizUrl,
    defaultEventId,
    keycloakUrl,
    keycloakRealm,
    keycloakClientId,

    moneizClient,
  };
});
