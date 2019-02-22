const express = require("express");
const dbRouter = express.Router();
const mongoose = require("mongoose");
const MongoClient = require('mongodb').MongoClient;

const url = "mongodb://mongodb:27017/";
// Variable to be sent to Frontend with Database status

var database
var TIC // test info collection
var TICname = "testInfo"
var counter = 0
var started

function startMongo () {

	MongoClient.connect(url, { 
		useNewUrlParser: true, 
		reconnectTries: 5, 
		reconnectInterval: 1000,
		autoReconnect: true
	}, function(err, db) {
		console.log("were trying and... ")
	  if (err) {
		  console.log("we fucked it up")
		  console.log(err)
	  }
	  else {
		  console.log("we got it boyz")
		  database = db.db("mydb")
		  database.createCollection(TICname)
		  started = true;
	  }
	});
}

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

startMongo()

module.exports = dbRouter
