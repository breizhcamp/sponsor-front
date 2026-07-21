import { queryOptions, useQuery } from '@tanstack/vue-query';
import type { AxiosInstance } from 'axios';

import type { LevelListApi } from '@/dto/moneiz/LevelListApi';
import { useMoneiz } from '@/utils/moneiz';

export function listSponsoringLevelsOptions(moneiz: AxiosInstance) {
  return queryOptions({
    queryKey: ['moneiz', 'levels'],
    queryFn: async () => {
      const response = await moneiz.get<LevelListApi[]>('/api/public/levels');
      return response.data;
    },
  });
}

export function listSponsoringLevels() {
  const moneiz = useMoneiz();
  return useQuery(listSponsoringLevelsOptions(moneiz));
}
