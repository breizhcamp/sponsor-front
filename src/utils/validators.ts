import * as validators from '@vuelidate/validators';
import { helpers } from '@vuelidate/validators';
import { type Ref, toValue } from 'vue';

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

export const between = (min: number, max: number | Ref<number>) => {
  const maxValue = toValue(max).toString();
  return helpers.withMessage(
    `La valeur dois être comprise entre ${min.toString()} et ${maxValue}`,
    validators.between(min, max),
  );
};

export const integer = helpers.withMessage(
  'La valeur dois être un nombre entier',
  validators.integer,
);

export const url = helpers.withMessage(
  'L\'URL n\'est pas valide',
  validators.url,
);
