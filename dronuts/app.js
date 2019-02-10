var express = require('express')
var path = require('path')
var app = express()

const port = 80 

app.use(express.static(path.join(__dirname, 'client','public')))
console.log(path.join(__dirname,'client','public','index.html'))
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname,'client','public','index.html'))
})

app.listen(port, () => console.log("listening"));
