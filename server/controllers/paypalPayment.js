var mongoose = require('mongoose');
var User = mongoose.model('User');
var rentModel = require('../models/rent');
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
var rentingItem={};
var renterId;
var ownerId;
// initially configuration paypal module
paypal.configure(config.api);
// Routes

// this method will creat a payment for lending item
// @parameter: item price, owner id of the item (that use to get owner paypal email)
exports.create = function (req, res) {
	//console.log("khanh inside create method in the paypal payment js file checking $price: "+req.body.price);
	// find owner paypal email
	User
      .findById(req.body.ownerId)
      .exec(function(err, user) {
        if (err){
        //   console.log("failed to find user in create payment method");
           
        } else {
         //  console.log("successfully find owner paypal email in creat payment method "+ user.name);             
           itemOwnerPaypalEmail = user.paypalAccount;
        }
      });
    itemPrice = req.body.price;  
    rentingItem.itemId = req.body.itemId;	
    rentingItem.itemName = req.body.itemName;
    rentingItem.itemImage = req.body.itemImage;
    rentingItem.itemDescription = req.body.itemDescription;
    rentingItem.itemEndDate = req.body.itemEndDate;
    renterId = req.body.renterId;
    ownerId = req.body.ownerId;
	var payment = {
		"intent": "sale",
		"payer": {
			"payment_method": "paypal"
		},
		"redirect_urls":{
			"return_url": "https://lendit195.herokuapp.com/execute",
			"cancel_url": "https://lendit195.herokuapp.com/cancel"
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
	//console.log("print out payment id inside execute method:"+paymentId);
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
		    	// update item state
		    	updateItemState(rentingItem.itemId,rentingItem.itemEndDate);
		    	//update renter item
		    	updateRenterItem(renterId,rentingItem);
		    	// update transaction history for both renter and lender
		    	updateTransactionHistory();
		        console.log(response);
		        console.log('khanh testing '+ response.paymentInfoList.paymentInfo);
		    }
		  }); // end auto payment from lendit account to the item's owner account

	    //  res.send("Hell yeah complete payment!"+" <a href='/'> "+"click here to go back to home page"+"</a>");
	      res.redirect("/#/profile");	
	    }
	});
};

exports.cancel = function (req, res) {
 // res.redirect('/cancel');
 	//res.send("Your payment is canceled"+" <a href='/'> "+"click here to go back to home page"+"</a>");
 	res.redirect("/#/profile");
};

var updateItemState = function(id,end){
	var updateFact={
		otherId: renterId,
		endDate: end,
		state: "Unavailable"
	};
	rentModel.update({_id: id}, updateFact, function(err) {
      if (err)
         return;
      //res.send("Item Update Successfully");
   })
}// end update item state

var updateRenterItem = function(renterId, Item){
	User.findById(renterId, function(err, userData){
                var user = userData;
                user.currentlyRenting.push(Item);
                user.save(function(err){
                    if (err){
                        //console.log("failed save")
                       // res.json({status: 500})
                       return;
                    } else {
                        //console.log("save successful");
                        
                   //     console.log("update renter item successfully");
                    }
                })
            });
}// end update renter item

var updateTransactionHistory =function(){
	// update for payer (or renter)
	var tran1={
		paytype: "Pay",
		amount: itemPrice,
		itemName: rentingItem.itemName
	};
	User.findById(renterId, function(err, userData){
	//	console.log("successfully found renter "+userData.name);
                var user = userData;
                user.transactionHistory.push(tran1);
                user.save(function(err){
                    if (err){
                        //console.log("failed save")
                       // res.json({status: 500})
                       return;
                    } else {
                        //console.log("save successful");
                        
                //        console.log("update renter item successfully");
                    }
                })
            });
	// update for reciever (or lender)
	var tran2={
		paytype: "Get",
		amount: itemPrice,
		itemName: rentingItem.itemName
	};
	User.findById(ownerId, function(err, userData){
	//	console.log("successfully found owner "+userData.name);
                var user = userData;
                user.transactionHistory.push(tran2);
                user.save(function(err){
                    if (err){
                        //console.log("failed save")
                       // res.json({status: 500})
                       return;
                    } else {
                        //console.log("save successful");
                        
                     //   console.log("update renter item successfully");
                    }
                })
            });
} // end update transaction history