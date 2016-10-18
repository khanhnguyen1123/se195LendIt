var mongoose = require('mongoose');
//var User = mongoose.model('User');
//var RequestedItem = mongoose.model('RequestedItem');
var RequestedItem = require('../datasets/requestedItems.js');

// post requested item
module.exports.post = function(req, res){
      //Creates a new superhero
      var newRequestedItem = new RequestedItem(req.body);
      //Save it into the DB.
      newRequestedItem.save(function(err){
        if(err) res.send(err);
        //If no errors, send it back to the client
        res.json(req.body);

      });
}; // end post requested item

