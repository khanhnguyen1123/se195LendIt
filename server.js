var express = require('express');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var bodyParser= require('body-parser');
var passport = require('passport');
var jwt = require('express-jwt');
//var expose = require('express-expose');
//var state = require('express-state');

var auth = jwt({
  secret: 'MY_SECRET',
  userProperty: 'payload'
});
var fbVerifyCurrentUserToken;

require('./server/controllers/passport');

var app = express();
var authenticationController = require('./server/controllers/authentication');
var profileAuthenticationController = require('./server/controllers/profile');
var postedRequestedItemController = require('./server/controllers/postedRequestedItem');
var postedLendingItemController =   require('./server/controllers/postedLendingItem');


//  [khanh] create a collection named time-waste in your local mongodb server to run this line of code
//mongoose.connect('mongodb://localhost:27017/time-waste')
mongoose.connect('mongodb://lendit:lendit@ds047146.mlab.com:47146/lendit');

app.use(bodyParser.json());
//app.use(multipartMiddleware);
app.use(cookieParser());
app.use('/public',express.static(__dirname + "/public"));
app.use('/node_modules',express.static(__dirname+'/node_modules'));
app.use(passport.initialize());
//app = expose(app);
//state.extend(app);


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
         //   console.log("inside facebook call back to test auth id "+auth+ " end auth ");
         //   authenticationController.login(req,res.redirect("/#/user/login"));
          //  res.redirect('/#/register?access_token='+req.user.generateJwt());
     	//	res.send('khanh nguyen');
     	//	res.json({'khanh ng': 'tran','email':req.user.email});
     		fbVerifyCurrentUserToken = req.user.generateJwt();
     		res.redirect("/#/fbredirect");	

        });

app.post('/api/user/fbRedirectLogin',function(req,res){
	console.log("khanh inside fbRedirectLogin "+fbVerifyCurrentUserToken);
	res.json({
        "token" : fbVerifyCurrentUserToken
      });
});

// profile
app.get('/api/profile', auth, profileAuthenticationController.profileRead);
app.post('/api/profile/editPhoto',profileAuthenticationController.updatePhoto);
app.post('/api/profile/editProfile',profileAuthenticationController.editProfile);

// post requested items
app.post('/api/requestedItem/post',postedRequestedItemController.post);
app.get('/api/requestedItem/get',postedRequestedItemController.getAll);
app.get('/api/requestedItem/get/:id',postedRequestedItemController.getOne);
app.post('/api/requestedItem/getUserItems',postedRequestedItemController.getUserItems);
// post lending items
app.post('/api/lendingItem/post',postedLendingItemController.post);
app.get('/api/lendingItem/get',postedLendingItemController.getAll);
app.get('/api/lendingItem/get/:id',postedLendingItemController.getOne);
app.post('/api/lendingItem/getUserItems',postedLendingItemController.getUserItems);

var port = process.env.PORT  || 5000;
app.listen(port, function(){
	console.log("SE 195 Successfull connected to mongodb server (local host: )"+port);
});