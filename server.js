var express = require('express');
var mongoose = require('mongoose');
var bodyParser= require('body-parser');


var app = express();
// create a collection named time-waste in your local mongodb server to run this line of code
mongoose.connect('mongodb://localhost:27017/time-waste')

app.use(bodyParser.json());
//app.use(multipartMiddleware);
app.use('/public',express.static(__dirname + "/public"));
app.use('/node_modules',express.static(__dirname+'/node_modules'));


app.get('/',function(req,res){
	res.sendFile(__dirname+'/index.html');
});


var port = process.env.PORT  || 5000;
app.listen(port, function(){
	console.log("SE 195 Successfull connected to mongodb server (local host: )"+port);
});