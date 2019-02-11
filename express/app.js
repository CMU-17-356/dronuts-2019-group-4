var express = require('express')
var path = require('path')
var cors = require('cors')
var app = express()

const port = 80 

app.use(cors())

app.get('/message', (req, res) => {
	console.log("hit the message API")
	res.json({
		message: "If you're seeing this, the Express API is working"
	})
})

app.listen(port, () => console.log("listening"));
