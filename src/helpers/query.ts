import { map, fromPairs, split, compose, assoc, reduce, keys, curry } from 'ramda';
import Joi from 'joi';

export type Transformations = {
  height?: number;
  width?: number;
  position?: 'center' | 'northwest' | 'north' | 'northeast' | 'west' | 'east' | 'southwest' | 'south' | 'southeast';
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  source?: undefined;
  x?: number;
  y?: number;
  quality?: number;
  extension: 'jpeg' | 'png' | 'webp';
};

const keysMap = {
  h: 'height',
  w: 'width',
  f: 'fit',
  p: 'position',
  q: 'quality',
};

const schema = Joi.object({
  height: Joi.number().min(1),
  width: Joi.number().min(1),
  x: Joi.number()
    .positive()
    .allow(0),
  y: Joi.number()
    .positive()
    .allow(0),
  source: Joi.optional(),
  fit: Joi.string().valid('cover', 'contain', 'fill', 'inside', 'outside'),
  position: Joi.string().valid('center', 'northwest', 'north', 'northeast', 'west', 'east', 'southwest', 'south', 'southeast'),
  quality: Joi.number()
    .min(1)
    .max(100),
  extension: Joi.string()
    .valid('jpeg', 'png', 'webp')
    .optional(),
});

export const withLiteral = curry((keysMap, obj) => reduce((acc, key) => assoc(keysMap[key] || key, obj[key], acc), {}, keys(obj)));

export const parse = (query: string, extension: string) =>
  compose(
    assoc('extension', extension),
    withLiteral(keysMap),
    fromPairs,
    // @ts-ignore
    map(split('_')),
    split(','),
  )(query);

export const validate = (transform: any): Joi.ValidationResult<Transformations> => Joi.validate(transform, schema);
