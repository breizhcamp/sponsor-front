import Keycloak from 'keycloak-js';
import { defineStore, storeToRefs } from 'pinia';
import { watch } from 'vue';

import { useConfigStore } from '@/stores/config.store';
import { deferred } from '@/utils';

export const useKeycloakStore = defineStore('keycloak', () => {
  const configStore = useConfigStore();
  const {
    keycloakUrl,
    keycloakRealm,
    keycloakClientId,
  } = storeToRefs(configStore);

  const {
    promise: keycloakPromise,
    resolve: resolveKeycloak,
    reject: rejectKeycloak,
  } = deferred<Keycloak>();

  const requireAuthentication = async (redirectUri: string): Promise<void> => {
    const keycloak = await keycloakPromise;
    if (keycloak.authenticated) return;

    const authenticated = await keycloak.init({
      onLoad: 'login-required',
      redirectUri,
      enableLogging: import.meta.env.DEV,
    });
    if (!authenticated) {
      throw new Error('authentication failed');
    }
    return;
  };

  const getToken = async (): Promise<string> => {
    const keycloak = await keycloakPromise;
    if (!keycloak.authenticated) return '';
    await keycloak.updateToken();
    return keycloak.token || '';
  };

  watch(
    [keycloakUrl, keycloakRealm, keycloakClientId],
    ([keycloakUrl, keycloakRealm, keycloakClientId]) => {
      if (keycloakUrl === undefined
        || keycloakRealm === undefined
        || keycloakClientId === undefined) return;

      try {
        resolveKeycloak(new Keycloak({
          url: keycloakUrl,
          realm: keycloakRealm,
          clientId: keycloakClientId,
        }));
      } catch (error: unknown) {
        rejectKeycloak(error);
      }
    },
    { immediate: true },
  );

  return {
    requireAuthentication,
    getToken,
  };
});
