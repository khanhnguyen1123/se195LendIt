var mongoose = require('mongoose');
var User = mongoose.model('User');
//var LendingItem = mongoose.model('LendingItem');
var LendingItem = require('../datasets/lendingItems.js');

// post Lending item
module.exports.post = function(req, res){
      //Creates a new 
      var newLendingItem = new LendingItem(req.body);
      console.log(JSON.stringify(req.location));
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
        user.lendingItems.push({lendingItemId: itemId});
        user.save();
      });
}; // end post Lending item

//get all lending item from not belong to current user
module.exports.getAll = function(req, res){
  console.log('User: '+ req.body._id + ' of type:' + Object.prototype.toString.call(req.body._id));
  var query = LendingItem.find({ownerId: {$ne: req.body._id}});
  query.exec(function(err, lendingItems){
        if(err) res.send(err);
        //If no errors, send them back to the client
        res.json(lendingItems);
      });
};

// get all requested items
module.exports.getAll = function(req, res){
      console.log('Getting all requested items');
      //Query the DB and if no errors, send all the superheroes
      var query = LendingItem.find({});
      query.exec(function(err, lendingItems){
        if(err) res.send(err);
        //If no errors, send them back to the client
        res.json(lendingItems);
      });
}; // end get all requested items

//get all lending item from not belong to current user
module.exports.getAllLoggedIn = function(req, res){
  console.log('User: '+ req.body._id + ' of type:' + Object.prototype.toString.call(req.body._id));
  var query = LendingItem.find({ownerId: {$ne: req.body._id}});
  query.exec(function(err, lendingItems){
        if(err) res.send(err);
        //If no errors, send them back to the client
        res.json(lendingItems);
      });
};

// get a lending item by id
module.exports.getOne = function(req, res){
  console.log('khanh inside get one to test passing id: '+req.params.id);
      LendingItem.findById(req.params.id, function(err, lendingItem){
        if(err) res.send(err);
        //If no errors, send it back to the client
        res.json(lendingItem);
      });   
};//end getting item by id

//get all lending item from a user
module.exports.getUserItems = function(req, res){
  console.log('User: '+ req.body._id + ' of type:' + Object.prototype.toString.call(req.body._id));
  var query = LendingItem.find({ownerId: req.body._id});
  query.exec(function(err, lendingItems){
        if(err) res.send(err);
        //If no errors, send them back to the client
        res.json(lendingItems);
      });
};//end getting user item


module.exports.getCategory = function(req,res){
  var category = req.params.category;
  LendingItem.find({'category':category},function(err,data){
    if(err) res.send(err);
        //If no errors, send it back to the client
        res.json(data);
  });// end calling finding function in mogoose    
}; // end getBookAndAudible function
