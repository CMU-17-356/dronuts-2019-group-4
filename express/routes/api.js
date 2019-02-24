const express = require("express");

const path = require('path')

const mongoUtil = require(path.join(__dirname,'../mongoUtil'))

const { droneSchema, 
		userSchema, 
		orderSchema } = require(path.join(__dirname,'../schema/schema'))

const apiRouter = express.Router();

const BaseJoi = require('joi');
const Extension = require('joi-date-extensions');
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

const unknownDatabaseError = {
	success: false,
	reason: "Database Error"
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
				res.json(successResponse(""))
			}
		}
	} else {
		res.json(unloadedDatabaseResponse)
	}
})

apiRouter.post("/userInfo", function(req, res, next) {
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
					res.send(databaseError)
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
		database.collection(TICname).findOne({"name":"CounterDoc"}, function(err, result) {
			if(err){
				res.send("Sorry we fucked see up")
			}
			else{
				res.json(result)
			}
		})
	} else {
		res.send("Oops! We're still getting ready!")
	}
})

apiRouter.post("/allOpenOrders", function(req, res, next) {
	loadDatabase()
	if(dbLoaded) {
		database.collection(TICname).findOne({"name":"CounterDoc"}, function(err, result) {
			if(err){
				res.send("Sorry we fucked see up")
			}
			else{
				res.json(result)
			}
		})
	} else {
		res.send("Oops! We're still getting ready!")
	}
})

module.exports = apiRouter
