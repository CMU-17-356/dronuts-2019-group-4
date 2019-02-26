const express = require("express");
const dbRouter = express.Router();
const MongoClient = require('mongodb').MongoClient;
const promiseRetry = require('promise-retry');

// Variable to be sent to Frontend with Database status
const DATABASE_NAME = "dronuts"
const ORDER_COLLECTION_NAME = "orders"
const DRONE_COLLECTION_NAME = "drones"
const USERS_COLLECTION_NAME = "users"

var database
var TIC // test info collection
var counter = 0
var started = false

const mongoOptions = {
		useNewUrlParser: true, 
		reconnectTries: 100, 
		reconnectInterval: 1000,
		autoReconnect: true
}
const url = "mongodb://mongodb:27017/";

const promiseOptions = {
	retries: mongoOptions.reconnectTries,
	factor: 2,
	minTimeout: mongoOptions.reconnectInterval,
	maxTimeout: 5000
}

const startMongo = () => {
	return promiseRetry((retry, number) => {
		return MongoClient.connect(url, mongoOptions).catch(retry);
	}, promiseOptions).then(mongoClient => {
		database = mongoClient.db(DATABASE_NAME)
		started = true;
	})
}

const getDatabase = () => {
	return database
}

module.exports = { 
	startMongo, 
	getDatabase,
	DATABASE_NAME, 
	ORDER_COLLECTION_NAME, 
	DRONE_COLLECTION_NAME, 
	USERS_COLLECTION_NAME
}
