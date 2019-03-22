
var schema = require('./../schema/schema.js');


describe('Test Order Schema', () => {

  it('Basic valid order 3 donuts and user', () => {
    const result = schema.Joi.validate({address: {
			number: "5000",
			streetname: "Forbes Ave",
			city: "Pittsburgh",
			state: "PA",
			zipcode: "19063"},
	items: [],
    price_dollars: 23,
    price_cents: 45,
	user: "sdsdsdsf",
	time:"11:30",
	timeOrdered: 234423124}, schema.order);
    expect(result.error).toBe(null);
  });

  it('Basic valid order 3 donuts no user', () => {
    const result = schema.Joi.validate({address: {
			number: "5000",
			streetname: "Forbes Ave",
			city: "Pittsburgh",
			state: "PA",
			zipcode: "19063"},
    items: [{ id: 2,
        image: "https://res.cloudinary.com/sivadass/image/upload/v1493620046/dummy-products/cauliflower.jpg",
        name: "Cauliflower - 1 Kg" ,
        price: 60 ,
        quantity: 1},{
        id: 3 ,
        image: "https://res.cloudinary.com/sivadass/image/upload/v1493620046/dummy-products/cucumber.jpg" ,
        name: "Cucumber - 1 Kg" ,
        price: 48 , 
        quantity: 1}],
    price_dollars: 23,
    price_cents: 45,
	timeOrdered: 234423124}, schema.order);
    expect(result.error).toBe(null);
  });


  it('Basic valid order long zipcode 2 donuts and user', () => {
    const result = schema.Joi.validate({address: {
			number: "5000",
			streetname: "Forbes Ave",
			city: "Pittsburgh",
			state: "PA",
			zipcode: "19063-4567"},
	items: [],
    price_dollars: 23,
    price_cents: 45,
	user: "sdsdsdsf",
	timeOrdered: 234423124}, schema.order);
    expect(result.error).toBe(null);
  });

  it('Basic valid order long zipcode space 2 donuts and user', () => {
    const result = schema.Joi.validate({address: {
			number: "5000",
			streetname: "Forbes Ave",
			city: "Pittsburgh",
			state: "PA",
			zipcode: "19063 4567"},
    items: [],
    price_dollars: 23,
    price_cents: 45,
	user: "sdsdsdsf",
	timeOrdered: 234423124}, schema.order);
    expect(result.error).toBe(null);
  });

  it('Invalid order too many cents', () => {
    const result = schema.Joi.validate({address: {
			number: "5000",
			streetname: "Forbes Ave",
			city: "Pittsburgh",
			state: "PA",
			zipcode: "19063 4567"},
	items: [],
    price_dollars: 23,
    price_cents: 105,
	user: "sdsdsdsf",
	timeOrdered: 234423124}, schema.order);
    expect(result.error).not.toBe(null);
  });

  it('Invalid order negative dollars', () => {
    const result = schema.Joi.validate({address: {
			number: "5000",
			streetname: "Forbes Ave",
			city: "Pittsburgh",
			state: "PA",
			zipcode: "19063 4567"},
	items: [],
    price_dollars: -23,
    price_cents: 105,
	user: "sdsdsdsf",
	timeOrdered: 234423124}, schema.order);
    expect(result.error).not.toBe(null);
  });
});


describe('Test User Schema', () => {

  it('Basic valid user one address', () => {
    const result = schema.Joi.validate({ email: "ma@andrew.cmu.edu",
		username: "machang",
		isCustomer: 1,
		password: "asdaFDFD",
		birthdate: "07-01-1998",
		addresses: [{ number: "5000",
			streetname: "Forbes Ave",
			city: "Pittsburgh",
			state: "PA",
			zipcode: "19063"
		}]}, schema.user);
    expect(result.error).toBe(null);
  });

  it('Basic valid user not customer', () => {
    const result = schema.Joi.validate({ email: "ma@gmail.com",
		username: "machang",
		isCustomer: 0,
		password: "asdaFDFD",
		birthdate: "07-01-1998",
		addresses: [{ number: "5000",
			streetname: "Forbes Ave",
			city: "Pittsburgh",
			state: "PA",
			zipcode: "19063"
		}]}, schema.user);
    expect(result.error).toBe(null);
  });

  it('Basic valid user three address', () => {
    const result = schema.Joi.validate({ email: "ma@andrew.cmu.edu",
		username: "machang",
		isCustomer: 1,
		password: "asdaFDFD",
		birthdate: "07-01-1998",
		addresses: [{ number: "5000",
			streetname: "Forbes Ave",
			city: "Pittsburgh",
			state: "PA",
			zipcode: "19063"
		},
		{ number: "5086",
			streetname: "Forbes Ave",
			city: "Pittsburgh",
			state: "PA",
			zipcode: "15213-4853"
		},
		{ number: "5032",
			streetname: "Forbes Ave",
			city: "Pittsburgh",
			state: "PA",
			zipcode: "19063 2324"
		}]}, schema.user);
    expect(result.error).toBe(null);
  });

  it('Invalid user too young', () => {
    const result = schema.Joi.validate({ email: "ma@gmail.com",
		username: "machang",
		isCustomer: 1,
		password: "asdaFDFD",
		birthdate: "07-01-2002",
		addresses: [{ number: "5000",
			streetname: "Forbes Ave",
			city: "Pittsburgh",
			state: "PA",
			zipcode: "19063"
		}]}, schema.user);
    expect(result.error).not.toBe(null);
  });

  it('Invalid user bad zip', () => {
    const result = schema.Joi.validate({ email: "ma@gmail.com",
		username: "machang",
		isCustomer: 1,
		password: "asdaFDFD",
		birthdate: "07-01-1998",
		addresses: [{ number: "5000",
			streetname: "Forbes Ave",
			city: "Pittsburgh",
			state: "PA",
			zipcode: "19062--1234"
		}]}, schema.user);
    expect(result.error).not.toBe(null);
  });

  it('Invalid user bad isCustomer', () => {
    const result = schema.Joi.validate({ email: "ma@gmail.com",
		username: "machang",
		isCustomer: 10,
		password: "asdaFDFD",
		birthdate: "07-01-1998",
		addresses: [{ number: "5000",
			streetname: "Forbes Ave",
			city: "Pittsburgh",
			state: "PA",
			zipcode: "19062--1234"
		}]}, schema.user);
    expect(result.error).not.toBe(null);
  });

});

describe('Test Drone Schema', () => {

  it('Basic valid drone w/o deliveries', () => {
    const result = schema.Joi.validate({ id: "abc", dateAdded: "07-01-1998"}, schema.drone);
    expect(result.error).toBe(null);
  });

  it('Basic valid drone w deliveries', () => {
    const result = schema.Joi.validate({ id: "abcada", dateAdded: "07-01-1998", deliveries:123}, schema.drone);
    expect(result.error).toBe(null);
  });

  it('invalid drone bad date', () => {
    const result = schema.Joi.validate({ id: "abc", dateAdded: "07-01198", deliveries:123}, schema.drone);
    expect(result.error).not.toBe(null);
  });

  it('invalid drone bad id', () => {
    const result = schema.Joi.validate({ id: 12, dateAdded: "07-01-1998", deliveries:123}, schema.drone);
    expect(result.error).not.toBe(null);
  });

  it('invalid drone bad deliveries', () => {
    const result = schema.Joi.validate({ id: "absda", dateAdded: "07-01-1998", deliveries:"a"}, schema.drone);
    expect(result.error).not.toBe(null);
  });

});