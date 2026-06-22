export interface SponsorApplicationReq {
  companyName: string;
  contact: SponsorApplicationContactReq;
  sponsoringLevel: string;
  additionalInformations?: string;
}

export interface SponsorApplicationContactReq {
  firstname?: string;
  lastname: string;
  email: string;
}
