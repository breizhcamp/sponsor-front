import { inject, type InjectionKey, type Ref } from 'vue';

import type { EventId } from '@/dto/kalon/Event';
import type { ModuleConfiApi } from '@/dto/kalon/ModuleConfigApi';

export const defaultEventIdKey: InjectionKey<Ref<EventId | undefined>> = Symbol('defaultEventId');

export const getConfigValue = (
  config: Ref<ModuleConfiApi[] | undefined>,
  key: string,
): string | undefined => {
  if (config.value === undefined) return undefined;
  return config.value.find(entry => entry.key === key)?.value;
};

export const useDefaultEventId = (): EventId => {
  const defaultEventId = inject(defaultEventIdKey);
  if (defaultEventId?.value === undefined) {
    throw new Error('default event id has not been initialized');
  }
  return defaultEventId.value;
};
