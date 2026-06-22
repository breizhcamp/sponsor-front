import { queryOptions, useQuery } from '@tanstack/vue-query';
import type { AxiosInstance } from 'axios';

import type { EventId } from '@/dto/kalon/Event';
import type { LevelListApi } from '@/dto/moneiz/LevelListApi';
import { useMoneiz } from '@/utils/moneiz';

export function listSponsoringLevelsOptions(
  moneiz: AxiosInstance,
  eventId: EventId,
) {
  return queryOptions({
    queryKey: ['moneiz', eventId, 'levels'],
    queryFn: async () => {
      const response = await moneiz.get<LevelListApi[]>(
        `/api/public/${eventId}/levels`,
      );
      return response.data;
    },
  });
}

export function listSponsoringLevels(eventId: EventId) {
  const moneiz = useMoneiz();
  return useQuery(listSponsoringLevelsOptions(moneiz, eventId));
}
