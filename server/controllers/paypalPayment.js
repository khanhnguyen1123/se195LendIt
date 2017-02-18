var mongoose = require('mongoose');
var User = mongoose.model('User');
var paypal = require('paypal-rest-sdk');
var pay = require('paypal-pay')(
{
      //required parameters
      'userId': 'khanhnguyen1123-facilitator_api1.gmail.com',
      'password': 'C4JZVBPR4R7QS3UU',
      'signature' : 'An5ns1Kso7MWUdW4ErQKJJJ4qi4-A2.RnYKJQ8y-EGqHXXomEWXmAaqf',

      //make sure that senderEmail and above credentials are from the same paypal account
      //otherwise paypal won't compete payment automatically
      'senderEmail' : 'khanhnguyen1123-facilitator@gmail.com',

      //optional parameters and their defaults
      'sandbox': true,
      'feesPayer': 'SENDER',
      'currencyCode': 'USD',
});
var config = {
  "port" : 5000,
  "api" : {
    "host" : "api.sandbox.paypal.com",
    "port" : "",            
    "client_id" : "Adp4zWEwj4Z6y4F-6KcSgKm4v5DCeuLdXW0y3Ajxg25uVjJvJxTRhen8W9Yg5jsCiWXw-Ka-PnzmLUIi",  // your paypal application client id
    "client_secret" : "EElohP0Qu611Q1Dxu6RuKFkQWBfNrEP72Nj3vl5Id_ufLxwPUcuYVN6OyfzDzll3C7FYmn3PQoq2Qjvo" // your paypal application secret id
  }
};
var paypalPaymentID;
var itemOwnerPaypalEmail;
var itemPrice;
// initially configuration paypal module
paypal.configure(config.api);
// Routes

// this method will creat a payment for lending item
// @parameter: item price, owner id of the item (that use to get owner paypal email)
exports.create = function (req, res) {
	console.log("khanh inside create method in the paypal payment js file checking $price: "+req.body.price);
	// find owner paypal email
	User
      .findById(req.body.ownerId)
      .exec(function(err, user) {
        if (err){
           console.log("failed to find user in create payment method");
           
        } else {
           console.log("successfully find owner paypal email in creat payment method");             
           itemOwnerPaypalEmail = user.paypalAccount;
        }
      });
    itemPrice = req.body.price;  
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
				"total": req.body.price
			},
			"description": 'awesomeness ohhh hoooo'
		}]
	};
	

	paypal.payment.create(payment, function (error, payment) {
	  if (error) {
	    console.log("khanh falling to call create payment"+error);
	  } else {
	     // need to use session for storing this paymentID
	     // req.session.paymentId = payment.id;
	      paypalPaymentID = payment.id;
	      console.log('print out payment id: '+paypalPaymentID);
	      var redirectUrl={};
	      for(var i=0; i < payment.links.length; i++) {
	        var link = payment.links[i];
	        if (link.method === 'REDIRECT') {
	          redirectUrl.link = link.href;
	        }
	      }
	      //res.redirect(redirectUrl);
	      res.status(200).json(redirectUrl);
	  }
	});
	
}; // end creat method

exports.execute = function (req, res) {
	//var paymentId = req.session.paymentId;
	var paymentId = paypalPaymentID;
	var payerId = req.param('PayerID');

	var details = { "payer_id": payerId };
	console.log("print out payment id inside execute method:"+paymentId);
	var payment = paypal.payment.execute(paymentId, details, function (error, payment) {
		if (error) {
	      console.log(error);
	    } else {
	      // make auto payment from lendit account to the item's owner account
	      pay(itemOwnerPaypalEmail, itemPrice, "This is an example memo", function(err, response){
		    if(err){
		        //response.error -- will contains errors if something went wrong
		        //see response examples below for more details

		        return;
		    }
		    if (response){
		        console.log(response);
		        console.log('khanh testing '+ response.paymentInfoList.paymentInfo);
		    }
		  }); // end auto payment from lendit account to the item's owner account

	      res.send("Hell yeah complete payment!"+" <a href='/'> "+"click here to go back to home page"+"</a>");
	    }
	});
};

exports.cancel = function (req, res) {
 // res.redirect('/cancel');
 	res.send("Your payment is canceled"+" <a href='/'> "+"click here to go back to home page"+"</a>");
};

