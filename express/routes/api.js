const express = require("express")

const path = require('path')

const mongoUtil = require(path.join(__dirname,'../mongoUtil'))
const ORDER_COLLECTION_NAME = mongoUtil.ORDER_COLLECTION_NAME
const DRONE_COLLECTION_NAME = mongoUtil.DRONE_COLLECTION_NAME
const USERS_COLLECTION_NAME = mongoUtil.USERS_COLLECTION_NAME

const droneManager = require(path.join(__dirname,'../droneManager'))
const orderManager = require(path.join(__dirname,'../orderManager'))


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

// takes in an order, generates an orderID and sends back the orderID which is generated here
//apiRouter.post("/addOrder", function(req, res, next) {
//	res.json(orderManager.addOrder(req.body))
//})

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
	orderManager.markOrderDone(req.body)
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

apiRouter.post("/allOrders", function(req, res, next) {
	return orderManager.allOrders()
})

apiRouter.post("/allUndoneOrders", function(req, res, next) {
	return orderManager.allUndoneOrders()
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

apiRouter.get("/getFreeDrone", function(req, res, next) {
	droneManager.getFreeDrone((id) => res.json(successResponse({droneID: id})))
})

apiRouter.post("/fillOrder", function(req, res, next) {
	const lat = req.body.latitude
	const lon = req.body.longitude
	const droneID = req.body.droneID
	const orderID = req.body.orderID
	orderManager.markOrderDone(orderID)
	droneManager.sendDroneWithLocation(droneID, lat, lon)
	res.json(successResponse())
})

module.exports = apiRouter
