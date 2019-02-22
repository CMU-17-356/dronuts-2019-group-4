var express = require('express')
var path = require('path')
var app = express()
var dbRouter= require(path.join(__dirname,'routes/db'))

const port = 80 

const CLIENT_BUILD_PATH = path.join(__dirname, '../client/build');
app.use(express.static(CLIENT_BUILD_PATH))

app.use('/db', dbRouter)

app.get('/', function(request, response) {
  response.sendFile(path.join(CLIENT_BUILD_PATH, 'index.html'));
});

app.get('/message', (req, res) => {
	console.log("hit the message API")
	res.json({
		message: "If you're seeing this, the Express API is working"
	})
})

app.listen(port, () => console.log("listening"))
