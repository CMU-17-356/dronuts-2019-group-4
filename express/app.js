const express = require('express')
const path = require('path')
const app = express()


const mongoUtil = require(path.join(__dirname,'mongoUtil'))
const apiRouter = require(path.join(__dirname,'routes/api'))

const port = 80
var TIC // test info collection
const TICname = "testInfo"
var counter = 0
var database

const CLIENT_BUILD_PATH = path.join(__dirname, '../client/build');
app.use(express.static(CLIENT_BUILD_PATH))

app.get('/', function(request, response) {
  response.sendFile(path.join(CLIENT_BUILD_PATH, 'index.html'));
});

app.get('/message', (req, res) => {
	console.log("hit the message API")
	res.json({
		message: "If you're seeing this, the Express API is working"
	})
})

app.use('/api',apiRouter)

mongoUtil.startMongo().then(() => {
	database = mongoUtil.getDatabase()
	app.listen(port, () => console.log("listening"))
})


