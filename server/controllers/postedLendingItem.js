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
        user.lendingItems.push({lendingItemId: itemId});
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

module.exports.updateItem = function(req, res) {
  LendingItem.findById(req.body._id, function(err, data) {
    if (req.body.name) data.name = req.body.name;
    if (req.body.category) data.category = req.body.category;
    if (req.body.description) data.description = req.body.description;
    if (req.body.pictures) data.pictures = req.body.pictures;
    if (req.body.price) data.price = req.body.price;
    if (req.body.priceOption) data.priceOption = req.body.priceOption;
    if (req.body.quantity) data.quantity = req.body.quantity;
    if (req.body.state) data.state = req.body.state;
    data.save(function (err) {
      if (err)
        res.send(err);
      res.send("Item Update Successful");
    })
  });
}
