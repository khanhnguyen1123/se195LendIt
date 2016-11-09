var mongoose = require('mongoose');
var User = mongoose.model('User');
//var RequestedItem = mongoose.model('RequestedItem');
var RequestedItem = require('../datasets/requestedItems.js');

// post requested item
module.exports.post = function(req, res){
      //Creates a new 
      var newRequestedItem = new RequestedItem(req.body);
      var ItemId;      
      //Save it into the DB.
      newRequestedItem.save(function(err,item){
        if(err) res.send(err);
        //If no errors, send it back to the client
        ItemId = item._id;
        console.log("tetsing to get Item ID inside save function"+item._id);
        res.json(req.body);

      });
      // add this requested item to user requested items list
      User
      .findById(req.body.ownerId)
      .exec(function(err, user) {
        user.requestedItems.push({requestedItemId: ItemId});
        user.save();
      });
}; // end post requested item


// get all requested items
module.exports.getAll = function(req, res){
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
      RequestedItem.findById(req.params.id, function(err, requestedItem){
        if(err) res.send(err);
        //If no errors, send it back to the client
        res.json(requestedItem);
      });   
};

module.exports.getCategory = function(req,res){
  var category = req.params.category;
  RequestedItem.find({'category':category},function(err,data){
    if(err) res.send(err);
        //If no errors, send it back to the client
        res.json(data);
  });// end calling finding function in mogoose    
} // end getBookAndAudible function