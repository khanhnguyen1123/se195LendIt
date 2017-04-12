var express = require('express');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var bodyParser= require('body-parser');
var passport = require('passport');
//var session = require('express-session');
var jwt = require('express-jwt');
//var expose = require('express-expose');
//var state = require('express-state');
var paypalId;
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
var paypalPayment = require('./server/controllers/paypalPayment');
var googleGetAddr = require('./server/controllers/mapLocation');
var borrowController = require('./server/borrow/borrow-controller');


//  [khanh] create a collection named time-waste in your local mongodb server to run this line of code
//username: lendit195
//password: acdnhnkn195
//cl acccess: lendit:lendit@ds157529.mlab.com:57529/lendit
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://lendit:lendit@ds157529.mlab.com:57529/lendit')


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
app.get('/api/profile/get/:id',profileAuthenticationController.getOne);
app.post('/api/profile/updateUser',profileAuthenticationController.updateUser);
app.post('/api/profile/updateUserPhoto',profileAuthenticationController.updateUserPhoto);
app.post('/api/profile/editPhoto',profileAuthenticationController.updatePhoto);
app.post('/api/profile/editProfile',profileAuthenticationController.editProfile);
app.post('/api/profile/getAddress', profileAuthenticationController.getAddress);

// post requested items
app.post('/api/requestedItem/post',postedRequestedItemController.post);
app.get('/api/requestedItem/getAll',postedRequestedItemController.getAll);
app.post('/api/requestedItem/getLoggedin',postedRequestedItemController.getAllLoggedIn);
app.get('/api/requestedItem/get/:id',postedRequestedItemController.getOne);
app.post('/api/requestedItem/update',postedRequestedItemController.updateItem);
app.delete('/api/requestedItem/delete/:id',postedRequestedItemController.deleteItem);
app.post('/api/requestedItem/getUserItems',postedRequestedItemController.getUserItems);
app.get('/api/requestedItemCategory/get/:category',postedRequestedItemController.getCategory);

// post lending items
app.post('/api/lendingItem/post',postedLendingItemController.post);
app.get('/api/lendingItem/getAll',postedLendingItemController.getAll);
app.delete('/api/lendingItem/delete/:id',postedLendingItemController.deleteItem);
// app.get('/api/lendingItem/get',postedLendingItemController.getAll);
app.get('/api/lendingItem/get/:id',postedLendingItemController.getOne);
app.post('/api/lendingItem/update',postedLendingItemController.updateItem);
app.post('/api/lendingItem/getUserItems',postedLendingItemController.getUserItems);
app.get('/api/lendingItemCategory/get/:category',postedLendingItemController.getCategory);
app.post('/api/lendingItem/search',postedLendingItemController.searchRentingItem);
//Borrow 
app.post('/api/borrow/create', borrowController.createItem);
app.put('/api/borrow/update', borrowController.updateItem);
app.delete('/api/borrow/delete/:id', borrowController.deleteItem);
//Borrow Gets
app.get('/api/borrow/getAll',borrowController.getAll);
app.get('/api/borrow/get/:sort/:page', borrowController.getItems);
app.get('/api/borrow/category/:category/:sort/:page', borrowController.getItemsByCategory);
app.get('/api/borrow/id/:id', borrowController.getItemById);
app.get('/api/borrow/user/:id', borrowController.getItemsByOwner);
//Borrow Helper Methods
app.get('/api/borrow/get/count', borrowController.countItems);
app.get('/api/borrow/search/:key', borrowController.searchItems);
// paypal payment 
app.post('/create',paypalPayment.create);
app.get('/execute',paypalPayment.execute);
app.get('/cancel',paypalPayment.cancel);

//Google Location
app.post('/api/googleMap/getAddress',googleGetAddr.getAddress);

/*
var paypal = require('paypal-rest-sdk');
var config = {
  "port" : 5000,
  "api" : {
	"host" : "api.sandbox.paypal.com",
	"port" : "",            
	"client_id" : "AdQ8rLkte1eoawbHnyTwy8RkS_028sNfPESXTd9lTGoaXFQp5UU9UygRcD30bvqa-dVEZJEtywmvLC6X",  // your paypal application client id
	"client_secret" : "EBCR5pUp4PBZiOluVd0v8blPToCVX5oGc-rx5xB1T-97Mmx-yzv3tYrhvT4r6fXYyi-wTCYiszrmKorx" // your paypal application secret id
  }
};
paypal.configure(config.api);
app.post('/create',function (req, res) {
	console.log("khanh inside create method in the paypal payment js file ");
	
	var payment = {
		"intent": "sale",
		"payer": {
			"payment_method": "paypal"
		},
		"redirect_urls":{
			"return_url": "http://localhost:5000/execute",
			"cancel_url": "http://localhost:5000/cancel"
		},
		"transactions": [{
			"amount": {
				"currency": 'USD',
				"total": '5.00'
			},
			"description": 'awesomeness ohhh hoooo'
		}]
	};
	
>>>>>>> merge khanh nguyen to development branch [need fixing UI]

	paypal.payment.create(payment, function (error, payment) {
	  if (error) {
		console.log("khanh falling to call create payment"+error);
	  } else {
		
		  req.session.paymentId = payment.id;
		  var redirectUrl;
		  for(var i=0; i < payment.links.length; i++) {
			var link = payment.links[i];
			if (link.method === 'REDIRECT') {
			  redirectUrl = link.href;
			}
		  }
		  res.redirect(redirectUrl);
		
	  }
	});

});

//app.get('/create', paypalPayment.create);
app.get('/execute', function (req, res) {
	//var paymentId = req.session.paymentId;
	var paymentId = paypalId;
	var payerId = req.param('PayerID');

	var details = { "payer_id": payerId };
	var payment = paypal.payment.execute(paymentId, details, function (error, payment) {
		if (error) {
		  console.log(error);
		} else {
		  res.send("Hell yeah complete payment!");
		}
	});
}
	);
app.get('/cancel', function (req, res) {
  res.render('cancel');
}
	);

app.get('/khanh', function(req, res) {
   res.sendFile(__dirname+'/khanh.html');
});



app.post('/paynow', function(req, res) {
   // paypal payment configuration.
  var payment = {
  "intent": "sale",
  "payer": {
	"payment_method": "paypal"
  },
  "redirect_urls": {
	"return_url": "http://localhost:5000/execute",
	"cancel_url": "http://localhost:5000/cancel"
  },
  "transactions": [{
	"amount": {
	  "total":"5.00",
	  "currency":  "USD"
	},
	"description": "fucking stupid"
  }]
};

  paypal.payment.create(payment, function (error, payment) {
  if (error) {
	console.log(error);
  } else {
	if(payment.payer.payment_method === 'paypal') {
	//  req.session.paymentId = payment.id;
	  paypalId = payment.id;
	  console.log(" khanh print out payment id "+ paypalId);
	  var redirectUrl;
	  console.log(payment);
	  for(var i=0; i < payment.links.length; i++) {
		var link = payment.links[i];
		if (link.method === 'REDIRECT') {
		  redirectUrl = link.href;
		}
	  }
	  console.log("khanh redirectURL: " +redirectUrl);
	  res.redirect(redirectUrl);
	}
  }
});
});

*/
var port = process.env.PORT  || 5000;
app.listen(port, function(){
	console.log("SE 195 Successfull connected to mongodb server (local host: )"+port);
});
