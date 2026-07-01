import axios, { type AxiosInstance } from 'axios';
import { inject, type InjectionKey, type Ref } from 'vue';

import type { ModuleConfiApi } from '@/dto/kalon/ModuleConfigApi';

const KALON_URL: string = import.meta.env.VITE_KALON_URL;

export const moneizUrlKey: InjectionKey<Ref<string | undefined>> = Symbol('moneizUrl');
export const moneizClientKey: InjectionKey<Ref<AxiosInstance | undefined>> = Symbol('moneizClient');

export const getMoneizUrl = async (): Promise<string> => {
  const { data: config } = await axios.get<ModuleConfiApi[]>(KALON_URL + '/modules/config', {
    headers: {
      'X-Tenant-Host': location.host,
    },
  });
  const moneizUrl = config.find(entry => entry.key === 'MONEIZ_URL');
  if (!moneizUrl) throw new Error('failed to get moneiz url');
  return moneizUrl.value;
};

export const useMoneizUrl = (): string => {
  const moneizUrl = inject(moneizUrlKey);
  if (moneizUrl?.value === undefined) {
    throw new Error('moneiz url has not been initialized');
  }
  return moneizUrl.value;
};

export const useMoneiz = (): AxiosInstance => {
  const moneizClient = inject(moneizClientKey);
  if (moneizClient?.value === undefined) {
    throw new Error('moneiz client has not been initialized');
  }
  return moneizClient.value;
};
