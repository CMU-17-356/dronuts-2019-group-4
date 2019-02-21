const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const MongoClient = require('mongodb').MongoClient;

const url = "mongodb://mongodb:27017/";
// Variable to be sent to Frontend with Database status

var database
var TIC // test info collection
var TICname = "testInfo"
var counter = 0
var started

function startup () {
	MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
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

router.get("/add", function(req, res, next) {
	if(!started) {
		startup();
		res.send("sorry gimme a minute")
	} else {
		database.collection(TICname).updateOne({"name":"CounterDoc"}, {$set:{"counter": counter}}, {upsert: true})	
		counter += 1
		res.send("added one")
	}
});

router.get("/see", function(req, res, next) {
	if(!started) {
		startup();
		res.send("sorry gimme a minute")
	} else {
		database.collection(TICname).findOne({"name":"CounterDoc"}, function(err, result) {
			if(err){
				res.send("Sorry we fucked see up")
			}
			else{
				res.json(result)
			}
		})
	}
});

module.exports = router;
