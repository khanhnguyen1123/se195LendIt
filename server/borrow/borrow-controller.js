var mongoose = require('mongoose');
var User = mongoose.model('User');
var borrowModel = require('./borrow-model.js');

//Comment for Albert, Limit and Skip

//Create Item
module.exports.createItem = function(req, res) {
   let newItem = new borrowModel(req.body);
   newItem.name2 = name.toLowerCase();
   let itemID;
   //Saves Item to DB
   newItem.save(function(err, data) {
      if(err)
         res.send(err);
      itemID = data._id;
      res.json(req.body);
   });
   //Update User Item
   User
      .findById(req.body.ownerId)
      .exec(function(err, user) {
         user.borrowedItems.push({ borrowItemId : itemID});
         user.save();
      });
}
//Update Item
module.exports.updateItem = function(req, res) {
   req.body.lastUpdated = new Date();
   req.body.name2 = req.body.name.toLowerCase();
   borrowModel.update({_id: req.body._id}, req.body, function(err) {
      if (err)
         res.send(err);
      res.send("Item Update Successfully");
   })
}
//Delete Item
module.exports.deleteItem = function(req, res) {
   borrowModel.remove({_id: req.params.id}, function(err, data) {
      if (err)
         res.send(err);
      res.send("Item Delted Successfully");
   })
}

//Get Item
module.exports.getItems = function(req, res) {
   let query = borrowModel.find({}).sort({'dateAdded': -1}).limit(25).skip((req.params.page-1)*25);
   query.exec(function(err, data){
      if(err)
         res.send(err);
      res.json(data);
   });
}
//Get Item By ID
module.exports.getItemById = function(req, res) {
   borrowModel.findById(req.params.id, function(err, data) {
      if (err)
         res.send(err);
      res.send(data);
   })
}
//Get Item By Owner ID
module.exports.getItemsByOwner = function(req, res) {
   borrowModel.find({'ownerId':req.params.id},function(err,data){
      if(err) 
         res.send(err);    
      res.json(data);
  });
}
//Get Item Alphabetically
module.exports.getItemsByName = function(req, res) {
   let query = borrowModel.find({}).sort({'name2': 1}).limit(25).skip((req.params.page-1)*25);
   query.exec(function(err, data){
      if(err)
         res.send(err);
      res.json(data);
   });
}
//Get Item By Price Low to High Not Needed In Borrow
module.exports.getItemsByPriceLtH = function(req, res) {

}
//Get Item By Price High to Low Not Needed In Borrow
module.exports.getItemsByPriceHtL = function(req, res) {

}
//Get Item By Rating
module.exports.getItemsByRating = function(req, res) {
   let query = borrowModel.find({}).sort({'rating': -1}).limit(25).skip((req.params.page-1)*25);
   query.exec( function(err, data) {
      if(err)
         res.send(err);
      res.json(data);
   });
}
//Get Item By Category
module.exports.getItemsByCategory = function(req, res) {
   let query = borrowModel.find({'category': req.params.category}).sort({'dateAdded': -1}).limit(25).skip((req.params.page-1)*25);
   query.exec( function(err,data) {
      if(err) 
         res.send(err);    
      res.json(data);
  });
}
//Get Item By Category and Name
module.exports.getItemsByCategoryName = function(req, res) {
   let query = borrowModel.find({'category':req.params.category}).sort({'name2':1}).limit(25).skip((req.params.page-1)*25);
   query.exec( function(err,data) {
      if(err) 
         res.send(err);    
      res.json(data);
  });
}
//Get Item By Category and Price Low to High
module.exports.getItemsByCategoryPriceLtH = function(req, res) {
}
//Get Item By Category and Price High to Low
module.exports.getItemsByCategoryPriceHtL = function(req, res) { 
}
//Get Item By Category and Name
module.exports.getItemsByCategoryRating = function(req, res) { 
   let query = borrowModel.find({'category':req.params.category}).sort({'rating':-1}).limit(25).skip((req.params.page-1)*25);
   query.exec( function(err,data) {
      if(err) 
         res.send(err);    
      res.json(data);
  });
}