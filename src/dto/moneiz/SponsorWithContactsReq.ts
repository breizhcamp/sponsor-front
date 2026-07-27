import type { ContactReq } from '@/dto/moneiz/ContactReq';

export interface SponsorWithContactsReq {
  name: string;
  url: string;
  invoiceName: string;
  address: string;
  contacts: ContactReq[];
}
