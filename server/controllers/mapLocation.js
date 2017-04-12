var mongoose = require('mongoose');
var User = mongoose.model('User');

//get all lending item from not belong to current user
module.exports.getAddress = function(req, res){
  	console.log('User: '+ req.body + ' of type:' + Object.prototype.toString.call(req.body._id));
  	var userIDs = [];
  	userIDs = req.body.split(',');
  	var addresses = [];
  	userIDs.forEach(function(element) {
    	var user = User.find({ownerId: element});
    	addresses.push(data);
	});
  	var query = JSON.stringify(addresses);

  	query.exec(function(err, addresses){
        if(err) res.send(err);
        //If no errors, send them back to the client
        res.json(addresses);
      });
};

