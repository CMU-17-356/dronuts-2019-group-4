const express = require("express")

const path = require('path')

const mongoUtil = require(path.join(__dirname,'../mongoUtil'))
const ORDER_COLLECTION_NAME = mongoUtil.ORDER_COLLECTION_NAME
const DRONE_COLLECTION_NAME = mongoUtil.DRONE_COLLECTION_NAME
const USERS_COLLECTION_NAME = mongoUtil.USERS_COLLECTION_NAME


const schema = require(path.join(__dirname,'../schema/schema'))
const droneSchema = schema.drone
const userSchema = schema.user
const orderSchema = schema.order

const apiRouter = express.Router()

const BaseJoi = require('joi')
const Extension = require('joi-date-extensions')
const Joi = BaseJoi.extend(Extension);

const testSchema = Joi.any();

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

const invalidFormatResponse = (err) => {
	return {
		success: false,
		reason: "Database error",
		error: err
	}
}

const databaseError = (err) => {
	return {
		success: false,
		reason: "Database error",
		error: err
	}
}

const successResponse = (payload) => {
	return {
		success: true,
		data:payload
	}
}

apiRouter.post("/addOrder", function(req, res, next) {
	loadDatabase()
	if(dbLoaded) {
		Joi.validate(req.body, testSchema, (err, value) => {
			if(err) {
				console.log("Add Order wasn't correctly formatted")
				res.json(invalidFormatResponse(err))
			} else {
				const newValue = Object.assign({"orderID": orderID, "completed": false}, value)
				database.collection(ORDER_COLLECTION_NAME).insertOne(newValue)
				res.json(successResponse(newValue))
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
		Joi.validate(req.body, testSchema, (err, value) => {
			if(err) {
				console.log("Update Order wasn't correctly formatted")
				res.json(invalidFormatResponse(err))
			} else {
				database.collection(ORDER_COLLECTION_NAME).findOneAndDelete({"orderID": value.orderID})
				res.json(successResponse(value._id))
			}
		})
	} else {
		res.json(unloadedDatabaseResponse)
	}
})

apiRouter.post("/allItems", function(req, res, next) {
	loadDatabase()
	if(dbLoaded) {
		database.collection(ITEM_COLLECTION_NAME).find({}).toArray(
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
		database.collection(mongoUtil.ORDER_COLLECTION_NAME).find({}).toArray(
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

apiRouter.post("/allUndoneOrders", function(req, res, next) {
	loadDatabase()
	if(dbLoaded) {
		database.collection(mongoUtil.ORDER_COLLECTION_NAME).find({"completed": false}).toArray(
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
		Joi.validate(reqJSON, testSchema, (err, value) => {
			if(err) {
				console.log("Add User wasn't correctly formatted")
				res.json(invalidFormatResponse(err))
			} else {
				database.collection(mongoUtil.USERS_COLLECTION_NAME).insertOne(value)
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
		Joi.validate(reqJSON, testSchema, (err, value) => {
			if(err) {
				console.log("Add Drone wasn't correctly formatted")
				res.json(invalidFormatResponse(err))
			} else {
				database.collection(DRONE_COLLECTION_NAME).insertOne(value)
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
		Joi.validate(reqJSON, testSchema, (err, value) => {
			if(err) {
				console.log("Update Drone wasn't correctly formatted")
				res.json(invalidFormatResponse(err))
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
		database.collection(mongoUtil.DRONE_COLLECTION_NAME).find({}).toArray(
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