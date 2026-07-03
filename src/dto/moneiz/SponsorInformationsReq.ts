import type { ContactType } from '@/dto/moneiz/ContactType';

export interface SponsorInformationsReq {
  name: string;
  url: string;
  logo: File;
  contacts: SponsorInformationsContactReq[];
};

export interface SponsorInformationsContactReq {
  firstname?: string;
  lastname: string;
  email: string;
  type: ContactType[];
};
