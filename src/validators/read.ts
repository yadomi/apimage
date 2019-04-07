import Joi from "joi"

module.exports = {
	params: {
		publicId: Joi.string().regex(/^[a-zA-Z0-9]{12}$/),
		query: Joi.string().regex(/[a-z0-9,_]/),
		uuid: Joi.string()
			.regex(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}(?:\.[a-z]{3,4})?$/)
			.required()
	}
}
