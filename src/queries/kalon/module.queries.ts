import { queryOptions, useQuery } from '@tanstack/vue-query';

import type { ModuleConfiApi } from '@/dto/kalon/ModuleConfigApi';
import { kalon } from '@/utils/kalon';

export const getConfigOptions = () => queryOptions({
  queryKey: ['kalon', 'modules', 'config'],
  queryFn: async () => {
    const response = await kalon.get<ModuleConfiApi[]>(
      '/modules/config',
      {
        headers: {
          'X-Tenant-Host': location.host,
        },
      },
    );
    return response.data;
  },
  staleTime: Infinity,
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
});

export const getConfig = () => useQuery(getConfigOptions());
