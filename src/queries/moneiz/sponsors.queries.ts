import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/vue-query';
import type { AxiosInstance } from 'axios';

import type {
  SponsorWithContactsReq,
} from '@/dto/moneiz/SponsorWithContactsReq';
import type {
  SponsorWithContactsRes,
} from '@/dto/moneiz/SponsorWithContactsRes';
import { useMoneiz } from '@/utils/moneiz';

const useSponsorOptions = (
  moneiz: AxiosInstance,
) => queryOptions({
  queryKey: ['moneiz', 'sponsor'],
  queryFn: async () => {
    const {
      data,
    } = await moneiz.get<SponsorWithContactsRes>('/api/sponsor');
    return data;
  },
});

export const useSponsor = () => {
  const moneiz = useMoneiz();
  return useQuery(useSponsorOptions(moneiz));
};

export const useSubmitSponsorInformationsMutation = () => {
  const moneiz = useMoneiz();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (sponsorWithContactsReq: SponsorWithContactsReq) => {
      await moneiz.post(
        `/api/sponsor`,
        sponsorWithContactsReq,
      );
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: useSponsorOptions(moneiz).queryKey,
      });
    },
  });
};

export const useUploadSponsorLogoMutation = () => {
  const moneiz = useMoneiz();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (logo: File) => {
      const formData = new FormData();
      formData.append('logo', logo);
      await moneiz.post(`/api/sponsor/logo`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: useSponsorOptions(moneiz).queryKey,
      });
    },
  });
};
