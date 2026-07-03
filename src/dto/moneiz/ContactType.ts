export const ContactType = {
  PRINCIPAL: 'PRINCIPAL',
  INVOICE: 'INVOICE',
  COMMUNICATION: 'COMMUNICATION',
  TICKETS: 'TICKETS',
} as const satisfies Record<string, string>;

export type ContactType = typeof ContactType[keyof typeof ContactType];

export const contactTypeToString = {
  [ContactType.PRINCIPAL]: 'Principal',
  [ContactType.INVOICE]: 'Facturation',
  [ContactType.COMMUNICATION]: 'Communication',
  [ContactType.TICKETS]: 'Billetterie',
} as const satisfies Record<ContactType, string>;
