import { useMutation } from '@tanstack/vue-query';

import type { EventId } from '@/dto/kalon/Event';
import type { SponsorApplicationReq } from '@/dto/moneiz/SponsorApplicationReq';
import { useMoneiz } from '@/utils/moneiz';

export const useSponsorApplyMutation = () => {
  const moneiz = useMoneiz();
  return useMutation({
    mutationFn: async ({
      eventId,
      sponsorApplicationReq,
    }: {
      eventId: EventId;
      sponsorApplicationReq: SponsorApplicationReq;
    }) => {
      await moneiz.post(
        `/api/public/${eventId}/sponsors/apply`,
        sponsorApplicationReq,
      );
    },
  });
};
