import type { AxiosInstance } from 'axios';
import { storeToRefs } from 'pinia';

import { useConfigStore } from '@/stores/config.store';

export const useMoneiz = (): AxiosInstance => {
  const configStore = useConfigStore();
  const { moneizClient } = storeToRefs(configStore);
  if (moneizClient.value === undefined) {
    throw new Error('moneiz client has not been initialized');
  }
  return moneizClient.value;
};
