const BaseJoi = require('joi');
const Extension = require('joi-date-extensions');
const Joi = BaseJoi.extend(Extension);

const userSchema = Joi.object({
		email: Joi.string().email().required(),
		username: Joi.string().required(),
		isCustomer: Joi.number().integer().min(0).max(1),
		password: Joi.string().required(), // salted, hashed password
		birthdate: Joi.date().format('MM-DD-YYYY').max('01-01-2001').required(),
		addresses: Joi.array().items(Joi.object({
			number: Joi.number().integer().positive().required(),
			streetname: Joi.string().required(),
			city: Joi.string().required(),
			state: Joi.string().required(),
			zipcode: Joi.string().regex(/^\d{5}(?:[-\s]\d{4})?$/).required()
		})),
})

const droneSchema = Joi.object({
	id: Joi.string().required(),
	dateAdded: Joi.date().format('MM-DD-YYYY').required(),
	deliveries: Joi.number().integer().positive()
})

const orderSchema = Joi.object({
	orderID: Joi.string(),
	address: Joi.object({
			number: Joi.number().integer().positive().required(),
			streetname: Joi.string().required(),
			city: Joi.string().required(),
			state: Joi.string().required(),
			zipcode: Joi.string().regex(/^\d{5}(?:[-\s]\d{4})?$/).required()
		}).required(),
	donuts: Joi.array().items(Joi.string()).required(),
    price_dollars: Joi.number().integer().positive(),
    price_cents: Joi.number().integer().min(0).max(99),
	user: Joi.string(), // username of the user ordering
	timeOrdered: Joi.number().positive().integer().required().strict() // time in milliseconds
})

module.exports = {
	drone: droneSchema,
	user: userSchema,
	order: orderSchema,
	Joi: Joi
}
