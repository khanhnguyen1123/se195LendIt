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
      console.log('Getting all requested items');
      //Query the DB and if no errors, send all the superheroes
      var query = RequestedItem.find({});
      query.exec(function(err, requestedItems){
        if(err) res.send(err);
        //If no errors, send them back to the client
        res.json(requestedItems);
      });
}; // end get all requested items

// get a requested item by id
module.exports.getOne = function(req, res){
  console.log('khanh inside get one to test passing id: '+req.params.id);
      RequestedItem.findById(req.params.id, function(err, requestedItem){
        if(err) res.send(err);
        //If no errors, send it back to the client
        res.json(requestedItem);
      });   
};

// get all requested items by user id
module.exports.getUserItems = function(req, res){
      //Query the DB and if no errors, send all the superheroes
      console.log('User: '+ req.body._id + ' of type:' + Object.prototype.toString.call(req.body._id));
      var query = RequestedItem.find({ownerId: req.body._id});
      query.exec(function(err, requestedItems){
        if(err) res.send(err);
        //If no errors, send them back to the client
        res.json(requestedItems);
      });
}; // end get all requested items by user id

module.exports.getCategory = function(req,res){
  var category = req.params.category;
  RequestedItem.find({'category':category},function(err,data){
    if(err) res.send(err);
        //If no errors, send it back to the client
        res.json(data);
  });// end calling finding function in mogoose    
}; // end getBookAndAudible function

module.exports.updateItem = function(req, res) {
  RequestedItem.findById(req.body._id, function(err, data) {
    if (req.body.name) data.name = req.body.name;
    if (req.body.category) data.category = req.body.category;
    if (req.body.description) data.description = req.body.description;
    if (req.body.pictures) data.pictures = req.body.pictures;
    data.save( function (err) {
      if (err)
        res.send(err);
      res.send("Item Update Successful");
    })
  });
}
