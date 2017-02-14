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


// get all requested items
module.exports.getAll = function(req, res){
      console.log('Getting all requested items');
      //Query the DB and if no errors, send all the superheroes
      var query = RequestedItem.find({});
      query.exec(function(err, requestedItems){
        if(err) res.send(err);
        //If no errors, send them back to the client
        res.json(requestedItems);
      });
}; // end get all requested items

// get a requestd item by id
module.exports.getOne = function(req, res){
  console.log('khanh inside get one to test passing id: '+req.params.id);
      RequestedItem.findById(req.body.id, function(err, requestedItem){
        if(err) res.send(err);
        //If no errors, send it back to the client
        res.json(requestedItem);
      });   
};

// get all requested items by user id
module.exports.getUserItems = function(req, res){
      //Query the DB and if no errors, send all the superheroes
      var id = req.params.id;
      console.log('Get Requested Item from userID: ' + req.body.duc);
      var query = RequestedItem.find({ownerId: req.body._id});
      query.exec(function(err, requestedItems){
        if(err) res.send(err);
        //If no errors, send them back to the client
        res.json(requestedItems);
      });
}; // end get all requested items by user id