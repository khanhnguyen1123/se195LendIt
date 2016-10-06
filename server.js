var express = require('express');
var mongoose = require('mongoose');
var bodyParser= require('body-parser');
var passport = require('passport');
var jwt = require('express-jwt');

var auth = jwt({
  secret: 'MY_SECRET',
  userProperty: 'payload'
});

require('./server/controllers/passport');

var app = express();
var authenticationController = require('./server/controllers/authentication');
var profileAuthenticationController = require('./server/controllers/profile');

//  [khanh] create a collection named time-waste in your local mongodb server to run this line of code
mongoose.connect('mongodb://localhost:27017/time-waste')
//mongoose.connect('mongodb://lendit:lendit@ds047146.mlab.com:47146/lendit');

app.use(bodyParser.json());
//app.use(multipartMiddleware);
app.use('/public',express.static(__dirname + "/public"));
app.use('/node_modules',express.static(__dirname+'/node_modules'));
app.use(passport.initialize());


app.get('/',function(req,res){
	res.sendFile(__dirname+'/index.html');
});


// authentication
app.post('/api/user/register', authenticationController.register);
app.post('/api/user/login', authenticationController.login);
//facebook authentication
app.get('/auth/facebook', passport.authenticate('facebook', { scope : ['email'] }));
/*
app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/#/register',
            failureRedirect: '/#/login'
        }));
*/
app.get('/auth/facebook/callback',
        passport.authenticate('facebook', { failureRedirect: '/#/login' }),
        function(req, res) {
            console.log("khanh testing new call back"+req.user.name+ " user boby "+req.user.generateJwt());
            
            res.redirect('/#/register');

        });
// profile
app.get('/api/profile', auth, profileAuthenticationController.profileRead);


var port = process.env.PORT  || 5000;
app.listen(port, function(){
	console.log("SE 195 Successfull connected to mongodb server (local host: )"+port);
});