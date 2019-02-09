const Joi = require('joi');

const userSchema = Joi.object({
		email: Joi.string().email().required(),
		username: Joi.string().required(),
		password: Joi.string().required(), // salted, hashed password
		birthdate: Joi.date().min('1-1-2001').required(),
		addresses: Joi.array().items(Joi.object({
			number: Joi.integer().positive().required(),
			streetname: Joi.string().required(),
			city: Joi.string().required(),
			state: Joi.string().required(),
			zipcode: Joi.string().pattern('[0-9]{5}').required()
		}),
})

const droneSchema = Joi.object({
	id: Joi.string().required(),
	dateAdded: Joi.date().required(),
	deliveries: Joi.integer().positive()
})

const orderSchema = Joi.object({
	address = Joi.object({
			number: Joi.integer().positive().required(),
			streetname: Joi.string().required(),
			city: Joi.string().required(),
			state: Joi.string().required(),
			zipcode: Joi.string().pattern('[0-9]{5}').required()
		}).required(),
	donuts = Joi.array().items(Joi.string()).required(),
	user: Joi.string().required() // username of the user ordering
	timeOrdered: Joi.date().required()
})

module.exports = {
	drone: droneSchema,
	user: userSchema,
	order: orderSchema
}
