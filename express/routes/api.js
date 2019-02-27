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

// takes in an order, generates an orderID and sends back the orderID which is generated here
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

// takes in a string (order Id), and marks it as completed in the database
apiRouter.post("/markOrderDone", function(req, res, next) {
	loadDatabase()
	if(dbLoaded) {
		Joi.validate(req.body, testSchema, (err, value) => {
			if(err) {
				console.log("Update Order wasn't correctly formatted")
				res.json(invalidFormatResponse(err))
			} else {
				database.collection(ORDER_COLLECTION_NAME).updateOne({"orderID": value.orderID}, {$set:{"completed":true}})
				res.json(successResponse("Updated order"))
			}
		})
	} else {
		res.json(unloadedDatabaseResponse)
	}
})

// takes in order and replaces the current order with that ID,
// no upsert
apiRouter.post("/updateOrder", function(req, res, next) {
	loadDatabase()
	if(dbLoaded) {
		Joi.validate(req.body, testSchema, (err, value) => {
			if(err) {
				console.log("Update Order wasn't correctly formatted")
				res.json(invalidFormatResponse(err))
			} else {
				database.collection(ORDER_COLLECTION_NAME).replaceOne({"orderID": value.orderID}, value)
				res.json(successResponse("Updated order"))
			}
		})
	} else {
		res.json(unloadedDatabaseResponse)
	}
})

// returns a list of all available products that we deliver
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


apiRouter.post("/addUser", function(req, res, next) {
	loadDatabase()
	if(dbLoaded) {
		Joi.validate(req.body, testSchema, (err, value) => {
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

// takes in a users username as a string and returns all of a users data
apiRouter.post("/getUserInfo", function(req, res, next) {
	loadDatabase()
	if(dbLoaded) {
		var userInfo
		var userOrdersOpen
		var userOrdersDone
		database.collection(mongoUtil.USERS_COLLECTION_NAME).findOne({"username": req.body.username},
			function(err, result) {
				if(err){
					res.send(databaseError)
				} else {
					userInfo = result
				}
			})
		database.collection(mongoUtil.ORDER_COLLECTION_NAME).findAll({"user": req.body.username, "completed": false},
			function(err, result) {
				if(err){
					res.send(databaseError(err))
				} else {
					userOrdersOpen = result
				}
			})
		database.collection(mongoUtil.ORDER_COLLECTION_NAME).findAll({"user": req.body.username, "completed": true},
			function(err, result) {
				if(err){
					res.send(databaseError(err))
				} else {
					userOrdersDone = result
				}
			})
		res.json(successResponse({
			info: userInfo,
			openOrders: userOrdersOpen,
			doneOrders: userOrdersDone
		}))
	} else {
		res.json(unloadedDatabaseResponse)
	}
})

// takes in a drone and adds it to the database
// only returns success or failure
apiRouter.post("/addDrone", function(req, res, next) {
	loadDatabase()
	if(dbLoaded) {
		Joi.validate(req.body, testSchema, (err, value) => {
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

// update drone and replaces it based on id value
apiRouter.post("/updateDrone", function(req, res, next) {
	loadDatabase()
	if(dbLoaded) {
		Joi.validate(req.body, testSchema, (err, value) => {
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

// returns all drone information
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
