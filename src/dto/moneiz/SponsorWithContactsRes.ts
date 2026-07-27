import type { ContactRes } from '@/dto/moneiz/ContactRes';
import type { SponsorId } from '@/dto/moneiz/SponsorId';

export interface SponsorWithContactsRes {
  id: SponsorId;
  name: string;
  url?: string;
  logo?: string;
  invoiceName?: string;
  address?: string;
  contacts: ContactRes[];
}
