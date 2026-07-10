import { type Ref } from 'vue';

export const getConfigValue = (
  config: Ref<ModuleConfiApi[] | undefined>,
  key: string,
): string | undefined => {
  if (config.value === undefined) return undefined;
  return config.value.find(entry => entry.key === key)?.value;
};
