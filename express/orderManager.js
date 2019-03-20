const path = require('path')
const mongoUtil = require(path.join(__dirname,'mongoUtil'))
const ORDER_COLLECTION_NAME = mongoUtil.ORDER_COLLECTION_NAME

const {
  unloadedDatabaseResponse,
  invalidFormatResponse,
  databaseError,
  successResponse
} = require(path.join(__dirname, 'serverResponses'))

const BaseJoi = require('joi')
const Extension = require('joi-date-extensions')
const Joi = BaseJoi.extend(Extension);

const schema = require(path.join(__dirname,'schema/schema'))
const droneSchema = schema.drone

const testSchema = Joi.any();

var database = mongoUtil.getDatabase()
var dbLoaded = false

const loadDatabase = () => {
	if(database == undefined){
		database = mongoUtil.getDatabase()
		dbLoaded = (database != undefined)
	}
}

const addOrder = (order) => {
  loadDatabase()
  if(dbLoaded) {
    Joi.validate(req.body, testSchema, (err, value) => {
      if(err) {
        console.log("Add Order wasn't correctly formatted")
        return invalidFormatResponse(err)
      } else {
        const newValue = Object.assign({"orderID": orderID, "completed": false}, value)
        database.collection(ORDER_COLLECTION_NAME).insertOne(newValue)
        return successResponse(newValue)
        orderID += 1
      }
    })
  } else {
    return unloadedDatabaseResponse
  }
}

const updateOrder = (order) => {
	loadDatabase()
	if(dbLoaded) {
		Joi.validate(order, testSchema, (err, value) => {
			if(err) {
				console.log("Update Order wasn't correctly formatted")
				return invalidFormatResponse(err)
			} else {
				database.collection(ORDER_COLLECTION_NAME).replaceOne({"orderID": value.orderID}, value)
				return successResponse("Updated order")
			}
		})
	} else {
		return unloadedDatabaseResponse
	}
}

const markOrderDone = (orderID) => {
	loadDatabase()
	if(dbLoaded) {
			database.collection(ORDER_COLLECTION_NAME).updateOne({"orderID": orderID}, {$set:{"completed":true}})
			return successResponse("Updated order")
	} else {
		res.json(unloadedDatabaseResponse)
	}
}

const allOrders = () => {
  loadDatabase()
  if(dbLoaded) {
    database.collection(mongoUtil.ORDER_COLLECTION_NAME).find({}).toArray(
      function(err, result) {
        if(err){
          return databaseError(err)
        }
        else{
          return successResponse(result)
        }
      })
  } else {
    return unloadedDatabaseResponse
  }
}

module.export = {
  addOrder,
  markOrderDone,
  updateOrder,
  allOrders
}
