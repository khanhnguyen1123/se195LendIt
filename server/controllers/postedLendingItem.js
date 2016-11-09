var mongoose = require('mongoose');
var User = mongoose.model('User');
//var LendingItem = mongoose.model('LendingItem');
var LendingItem = require('../datasets/lendingItems.js');

// post Lending item
module.exports.post = function(req, res){
      //Creates a new 
      var newLendingItem = new LendingItem(req.body);
      var itemId;
      //Save it into the DB.
      newLendingItem.save(function(err,item){
        if(err) res.send(err);
        //If no errors, send it back to the client
        itemId = item._id;
        res.json(req.body);

      });
      // add this requested item to user lending items list
      User
      .findById(req.body.ownerId)
      .exec(function(err, user) {
        user.lendingItems.push({lendingItemId: ItemId});
        user.save();
      });
}; // end post Lending item


// get all lending items
module.exports.getAll = function(req, res){
      //Query the DB and if no errors, send all the superheroes
      var query = LendingItem.find({});
      query.exec(function(err, lendingItems){
        if(err) res.send(err);
        //If no errors, send them back to the client
        res.json(lendingItems);
      });
}; // end get all Lending items

// get a lending item by id
module.exports.getOne = function(req, res){
  console.log('khanh inside get one to test passing id: '+req.params.id);
      LendingItem.findById(req.params.id, function(err, lendingItem){
        if(err) res.send(err);
        //If no errors, send it back to the client
        res.json(lendingItem);
      });   
}; // end get one function


module.exports.getCategory = function(req,res){
  var category = req.params.category;
  LendingItem.find({'category':category},function(err,data){
    if(err) res.send(err);
        //If no errors, send it back to the client
        res.json(data);
  });// end calling finding function in mogoose    
} // end getBookAndAudible function