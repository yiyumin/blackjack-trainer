import Joi from 'joi';

import {
  modifierTypes,
  dealerKeys,
  pairKeys,
  softHandKeys,
  hardHandKeys,
} from './types';

const modifierSchema = Joi.object({
  type: Joi.string()
    .valid(...modifierTypes)
    .required(),
  allowed: Joi.boolean().required(),
}).unknown(false);

const handStatSchema = Joi.object({
  dealerKey: Joi.string()
    .valid(...dealerKeys)
    .required(),
  modifier: modifierSchema.optional(),
  timesSeen: Joi.number().integer().min(1).required(),
  timesCorrect: Joi.number()
    .integer()
    .min(0)
    .max(Joi.ref('timesSeen'))
    .required(),
}).unknown(false);

const statsSchema = Joi.object({
  pairs: Joi.array()
    .items(
      handStatSchema.keys({
        playerHandKey: Joi.string()
          .valid(...pairKeys)
          .required(),
      })
    )
    .required(),
  softHands: Joi.array()
    .items(
      handStatSchema.keys({
        playerHandKey: Joi.string()
          .valid(...softHandKeys)
          .required(),
      })
    )
    .required(),
  hardHands: Joi.array()
    .items(
      handStatSchema.keys({
        playerHandKey: Joi.string()
          .valid(...hardHandKeys)
          .required(),
      })
    )
    .required(),
});

const settingsSchema = Joi.object({
  isDoubleDownAllowed: Joi.boolean().required(),
  isDoubleDownAfterSplitAllowed: Joi.boolean().required(),
  isSurrenderAllowed: Joi.boolean().required(),
  isDarkModeEnabled: Joi.boolean().required(),
});

export { statsSchema, settingsSchema };
