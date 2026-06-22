import * as validators from '@vuelidate/validators';
import { helpers } from '@vuelidate/validators';

export const email = helpers.withMessage(
  'L\'email n\'est pas valide',
  validators.email,
);
export const maxLength = (max: number) => helpers.withMessage(
  `La longueur maximale autorisée est de ${max.toString()} caractères`,
  validators.maxLength(max),
);
export const required = helpers.withMessage(
  'Ce champ est requis',
  validators.required,
);
