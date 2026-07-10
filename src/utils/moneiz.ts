import { type AxiosInstance } from 'axios';
import { inject, type InjectionKey, type Ref } from 'vue';

export const moneizUrlKey: InjectionKey<Ref<string | undefined>> = Symbol('moneizUrl');
export const moneizClientKey: InjectionKey<Ref<AxiosInstance | undefined>> = Symbol('moneizClient');

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
