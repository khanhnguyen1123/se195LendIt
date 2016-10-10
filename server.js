<<<<<<< HEAD
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
=======
/************************************************************************
* REQUIRE MODULES
************************************************************************/
var express = require ( 'express');
var bodyParser = require ('body-parser');
var morgan = require ('morgan');
var config = require ('./config');
var mongoose = require('mongoose');

var app = express();



/************************************************************************
* DATABASE CONNECTION
************************************************************************/

mongoose.connect(config.database, function(err){
	if (err){
		console.log(err);
	}else{
		console.log('Connected to the database');
	}


});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan('dev'));


app.use(express.static(__dirname + '/public'));


var api = require('./app/routes/api')(app,express);
app.use ('/api', api);




app.get ('*',function(req, res)
{

	res.sendFile (__dirname + '/public/app/views/index.html');

});


app.listen(config.port,function (err){

    if (err){
    	console.log(err);
    }
    
    else {
    	console.log("Listening on port 3000");
    }

>>>>>>> d9bfbcba048b0c491c4f773330fbbc250bd2ccdd
});