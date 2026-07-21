import { useMutation } from '@tanstack/vue-query';

import type { SponsorApplicationReq } from '@/dto/moneiz/SponsorApplicationReq';
import { useMoneiz } from '@/utils/moneiz';

export const useCreateSponsorApplicationMutation = () => {
  const moneiz = useMoneiz();
  return useMutation({
    mutationFn: async (sponsorApplicationReq: SponsorApplicationReq) => {
      await moneiz.post(
        `/api/public/sponsor-applications`,
        sponsorApplicationReq,
      );
    },
  });
};
