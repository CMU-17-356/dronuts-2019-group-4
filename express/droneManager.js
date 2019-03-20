const path = require('path')

const mongoUtil = require(path.join(__dirname,'mongoUtil'))
const DRONE_COLLECTION_NAME = mongoUtil.DRONE_COLLECTION_NAME

const droneAPI = require(path.join(__dirname,'droneAPIManager'))

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

const getFreeDrone = (next) => {
  droneAPIManager.getFreeDroneID(next)
}

const sendDrone = (droneID, lat, lon) => {
  droneAPIManager.sendDroneWithLocation(droneID, lat, lon)
}

/*

const addDrone = (drone) => {
	loadDatabase()
	if(dbLoaded) {
		Joi.validate(drone, testSchema, (err, value) => {
			if(err) {
				console.log("Add Drone wasn't correctly formatted")
				return invalidFormatResponse(err)
			} else {
				database.collection(DRONE_COLLECTION_NAME).insertOne(value)
				return successResponse("Drone added successfully")
			}
		})
	} else {
		return unloadedDatabaseResponse
	}
}

const updateDrone = (drone) => {
	loadDatabase()
	if(dbLoaded) {
		Joi.validate(req.body, testSchema, (err, value) => {
			if(err) {
				console.log("Update Drone wasn't correctly formatted")
				return invalidFormatResponse(err)
			} else {
				database.collection(mongoUtil.DRONE_COLLECTION_NAME).findOneAndReplace({"id": value.id}, value)
				return successResponse("Updated drone successfully")
			}
		})
	} else {
		return unloadedDatabaseResponse
	}

}

const returnDrone = (drone) => {
	loadDatabase()
	if(dbLoaded) {
		Joi.validate(drone, testSchema, (err, value) => {
			if(err) {
				return invalidFormatResponse(err)
			} else {
				database.collection(mongoUtil.DRONE_COLLECTION_NAME).findOneAndReplace({"id": value}, {$set:{atBase: true}})
				return successResponse("Drone set to atBase successfully")
			}
		})
	} else {
		return unloadedDatabaseResponse
	}
})

const allDrones = () => {
	loadDatabase()
	if(dbLoaded) {
		database.collection(mongoUtil.DRONE_COLLECTION_NAME).find({}).toArray(
			function(err, result) {
				if(err){
					response databaseError(err)
				}
				else{
					response successResponse(result)
				}
			})
	} else {
		response unloadedDatabaseResponse
	}
}
*/

module.exports  = {
    sendDrone,
		getFreeDrone,
		// addDrone,
		// returnDrone,
		// allDrones
}
