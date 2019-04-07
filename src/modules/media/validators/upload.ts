import Joi from 'joi';

const Stream = Joi.object({
  pipe: Joi.func().required(),
}).unknown();

module.exports = {
  payload: {
    data: Stream.required(),
    uuid: Joi.string().uuid(),
  },
};
