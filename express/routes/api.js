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

const loadDatabase = () => {
	if(database == undefined){
		database = mongoUtil.getDatabase()
		dbLoaded = (database != undefined)
	}
}

const unloadedDatabaseResponse = {
	success: false,
	reason: "Request does not match our JOI validation"
}

const invalidFormatResponse = {
	success: false,
	reason: "Request does not match our JOI validation"
}

const databaseError = (err) = {
	success: false,
	reason: "Database error",
	err: err
}

const successResponse = (data) => {
	success: true,
	data: data
}

apiRouter.post("/addOrder", function(req, res, next) {
	loadDatabase()
	if(dbLoaded) {
		Joi.validate(req, orderSchema, (err, value) => {
			if(err) {
				res.json(invalidFormatResponse)
			} else {
				database.collection(mongUtil.ORDER_COLLECTION_NAME).updateOne(value)
				res.json(successResponse("Added order successfully"))
			}
		}
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

apiRouter.post("/getUserInfo", function(req, res, next) {
	loadDatabase()
	if(dbLoaded) {
		var userInfo 
		var userOrders
		database.collection(mongUtil.USERS_COLLECTION_NAME).findOne({"username": req.username}, 
			function(err, result) {
				if(err){
					res.send(databaseError)
				} else {
					userInfo = result
				}
			})
		database.collection(mongUtil.ORDER_COLLECTION_NAME).findAll({"user": req.username}, 
			function(err, result) {
				if(err){
					res.send(databaseError(err))
				} else {
					userOrders = result
				}
			})
		res.json(successResponse({info: userInfo, orders: userOrders})

	} else {
		res.json(unloadedDatabaseResponse)
	}
})

apiRouter.post("/addUser", function(req, res, next) {
	loadDatabase()
	if(dbLoaded) {
		Joi.validate(req, userSchema, (err, value) => {
			if(err) {
				res.json(invalidFormatResponse)
			} else {
				database.collection(mongoUtil.USERS_COLLECTION_NAME).updateOne(value)
				res.json(successResponse("Added user successfully"))
			}
		}
	} else {
		res.json(unloadedDatabaseResponse)
	}
})


apiRouter.post("/addDrone", function(req, res, next) {
	loadDatabase()
	if(dbLoaded) {
		Joi.validate(req, droneSchema, (err, value) => {
			if(err) {
				res.json(invalidFormatResponse)
			} else {
				database.collection(mongoUtil.DRONE_COLLECTION_NAME).updateOne(value)
				res.json(successResponse("Added user successfully"))
			}
		}
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
