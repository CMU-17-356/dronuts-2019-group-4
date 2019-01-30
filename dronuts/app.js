var express = require('express')
var app = express()

const port = 80 

app.use(express.static("public"))
app.get('/', (req, res) => {
	res.sendFile("public/index.html")
})

app.listen(port, () => console.log("listening"));
