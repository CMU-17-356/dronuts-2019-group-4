const express = require("express")

const path = require('path')

const mongoUtil = require(path.join(__dirname,'../mongoUtil'))

const schema = require(path.join(__dirname,'../schema/schema'))
const droneSchema = schema.drone
const userSchema = schema.user
const orderSchema = schema.order

const apiRouter = express.Router()

const BaseJoi = require('joi')
const Extension = require('joi-date-extensions')
const Joi = BaseJoi.extend(Extension);

var database = mongoUtil.getDatabase()
var dbLoaded = false

var orderID = 0

const loadDatabase = () => {
	if(database == undefined){
		database = mongoUtil.getDatabase()
		dbLoaded = (database != undefined)
	}
}

const unloadedDatabaseResponse = {
	success: false,
	reason: "Database is not loaded yet, try again soon"
}

const invalidFormatResponse = {
	success: false,
	reason: "Request does not match our JOI validation"
}

const databaseError = function (err) {
	return {
		success: false,
		reason: "Database error",
		error: err
	}
}

const successResponse = function (payload) {
	return {
		success: false,
		data:payload
	}
}


apiRouter.post("/addOrder", function(req, res, next) {
	loadDatabase()
	if(dbLoaded) {
		var reqJSON = JSON.parse(req)
		Joi.validate(reqJSON, orderSchema, (err, value) => {
			if(err) {
				res.json(invalidFormatResponse)
			} else {
				value.orderID = orderID
				database.collection(mongoUtil.ORDER_COLLECTION_NAME).updateOne(value)
				res.json(successResponse({orderID: orderID}))
				orderID += 1
			}
		})
	} else {
		res.json(unloadedDatabaseResponse)
	}
})


apiRouter.post("/updateOrder", function(req, res, next) {
	loadDatabase()
	if(dbLoaded) {
		var reqJSON = JSON.parse(req)
		Joi.validate(reqJSON, orderSchema, (err, value) => {
			if(err) {
				res.json(invalidFormatResponse)
			} else {
				database.collection(mongoUtil.ORDER_COLLECTION_NAME).findOneAndReplace({"orderID": value.orderID}, value)
				res.json(successResponse("Updated order"))
			}
		})
	} else {
		res.json(unloadedDatabaseResponse)
	}
})

apiRouter.post("/allItems", function(req, res, next) {
	loadDatabase()
	if(dbLoaded) {
		database.collection(mongoUtil.ITEM_COLLECTION_NAME).find(
			function(err, result) {
				if(err){
					res.send(databaseError(err))
				}
				else{
					res.json(result)
				}
			})
	} else {
		res.json(unloadedDatabaseResponse)
	}
})

apiRouter.post("/allOrders", function(req, res, next) {
	loadDatabase()
	if(dbLoaded) {
		database.collection(mongoUtil.ORDER_COLLECTION_NAME).find(
			function(err, result) {
				if(err){
					res.send(databaseError(err))
				}
				else{
					res.json(result)
				}
			})
	} else {
		res.json(unloadedDatabaseResponse)
	}
})


apiRouter.post("/addUser", function(req, res, next) {
	loadDatabase()
	if(dbLoaded) {
		var reqJSON = JSON.parse(req)
		Joi.validate(reqJSON, userSchema, (err, value) => {
			if(err) {
				res.json(invalidFormatResponse)
			} else {
				database.collection(mongoUtil.USERS_COLLECTION_NAME).updateOne(value)
				res.json(successResponse("Added user successfully"))
			}
		})
	} else {
		res.json(unloadedDatabaseResponse)
	}
})

apiRouter.post("/getUserInfo", function(req, res, next) {
	loadDatabase()
	if(dbLoaded) {
		var reqJSON = JSON.parse(req)
		var userInfo 
		var userOrders
		database.collection(mongoUtil.USERS_COLLECTION_NAME).findOne({"username": reqJSON.username}, 
			function(err, result) {
				if(err){
					res.send(databaseError)
				} else {
					userInfo = result
				}
			})
		database.collection(mongoUtil.ORDER_COLLECTION_NAME).findAll({"user": reqJSON.username}, 
			function(err, result) {
				if(err){
					res.send(databaseError(err))
				} else {
					userOrders = result
				}
			})
		res.json(successResponse({info: userInfo, orders: userOrders}))

	} else {
		res.json(unloadedDatabaseResponse)
	}
})

apiRouter.post("/addDrone", function(req, res, next) {
	loadDatabase()
	if(dbLoaded) {
		var reqJSON = JSON.parse(req)
		Joi.validate(reqJSON, droneSchema, (err, value) => {
			if(err) {
				res.json(invalidFormatResponse)
			} else {
				database.collection(mongoUtil.DRONE_COLLECTION_NAME).updateOne(value)
				res.json(successResponse("Added drone successfully"))
			}
		})
	} else {
		res.json(unloadedDatabaseResponse)
	}
})

apiRouter.post("/updateDrone", function(req, res, next) {
	loadDatabase()
	if(dbLoaded) {
		var reqJSON = JSON.parse(req)
		Joi.validate(reqJSON, droneSchema, (err, value) => {
			if(err) {
				res.json(invalidFormatResponse)
			} else {
				database.collection(mongoUtil.DRONE_COLLECTION_NAME).findOneAndReplace({"id": value.id}, value)
				res.json(successResponse("Updated drone successfully"))
			}
		})
	} else {
		res.json(unloadedDatabaseResponse)
	}
})

apiRouter.post("/allDrones", function(req, res, next) {
	loadDatabase()
	if(dbLoaded) {
		database.collection(mongoUtil.DRONE_COLLECTION_NAME).find(
			function(err, result) {
				if(err){
					res.send(databaseError(err))
				}
				else{
					res.json(result)
				}
			})
	} else {
		res.json(unloadedDatabaseResponse)
	}
})

module.exports = apiRouter
