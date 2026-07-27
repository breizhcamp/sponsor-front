import type { ContactId } from '@/dto/moneiz/ContactId';
import type { ContactType } from '@/dto/moneiz/ContactType';

export interface ContactReq {
  id?: ContactId;
  firstname?: string;
  lastname: string;
  email: string;
  type: ContactType[];
};
