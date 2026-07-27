import type { AxiosInstance } from 'axios';
import axios from 'axios';
import { storeToRefs } from 'pinia';

import { useConfigStore } from '@/stores/config.store';
import { useKeycloakStore } from '@/stores/keycloak.store';

export const createMoneizClient = (moneizUrl: string): AxiosInstance => {
  const moneiz = axios.create({ baseURL: moneizUrl });
  moneiz.interceptors.request.use(async (config) => {
    const { getToken } = useKeycloakStore();
    const token = await getToken();
    if (token !== '') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  return moneiz;
};

export const useMoneiz = (): AxiosInstance => {
  const configStore = useConfigStore();
  const { moneizClient } = storeToRefs(configStore);
  if (moneizClient.value === undefined) {
    throw new Error('moneiz client has not been initialized');
  }
  return moneizClient.value;
};
