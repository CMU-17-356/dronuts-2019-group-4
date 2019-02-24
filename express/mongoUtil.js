const express = require("express");
const dbRouter = express.Router();
const MongoClient = require('mongodb').MongoClient;
const promiseRetry = require('promise-retry');

// Variable to be sent to Frontend with Database status

var database
var TIC // test info collection
var TICname = "testInfo"
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
		database = mongoClient.db("mydb")
		started = true;
	})
}

const getDatabase = () => {
	return database
}

/*
dbRouter.get("/add", function(req, res, next) {
	if(!started) {
		startMongo();
		res.send("not started")
	} 
	database.collection(TICname).updateOne({"name":"CounterDoc"}, {$set:{"counter": counter}}, {upsert: true})	
	counter += 1
	res.send("added one")
});

dbRouter.get("/see", function(req, res, next) {
	if(!started) {
		startMongo()
		res.send("not started")
	}
	database.collection(TICname).findOne({"name":"CounterDoc"}, function(err, result) {
		if(err){
			res.send("Sorry we fucked see up")
		}
		else{
			res.json(result)
		}
	})
});
*/

module.exports = { startMongo, getDatabase }
