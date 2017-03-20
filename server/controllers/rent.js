var mongoose = require('mongoose');
var rentModel = require('../models/rent');

//Create Item
module.exports.createItem = function(req, res) {
   let newItem = new rentModel(req.body);
   newItem.name2 = req.body.name.toLowerCase();
   newItem.aRating = 0;
   let itemID;
   //Saves Item to DB
   newItem.save(function(err, data) {
      if(err)
         res.send(err);
      itemID = data._id;
      res.json(req.body);
   });
}
//Update Item
module.exports.updateItem = function(req, res) {
   req.body.lastUpdated = new Date();
   req.body.name2 = req.body.name.toLowerCase();
   rentModel.update({_id: req.body._id}, req.body, function(err) {
      if (err)
         res.send(err);
      res.send("Item Update Successfully");
   })
}
//Delete Item
module.exports.deleteItem = function(req, res) {
   rentModel.remove({_id: req.params.id}, function(err, data) {
      if (err)
         res.send(err);
      res.send("Item Delted Successfully");
   })
}
//Get Item
module.exports.getItems = function(req, res) {
   let sort = { "name2" : 1};
   if (req.params.sort == "date")
      sort = { "dateAdded" : -1};
   else if (req.params.sort == "rate")
      sort = { "rating" : -1};
   else if (req.params.sort == "priceLtH")
      sort = { "price" : 1};
   else if (req.params.sort == "priceHtL")
      sort = { "price" : -1};

   let query = rentModel.find({}).sort(sort).limit(25).skip((req.params.page-1)*25);
   query.exec(function(err, data){
      if(err)
         res.send(err);
      res.json(data);
   });
}
//Get Item By Category
module.exports.getItemsByCategory = function(req, res) {
   let sort = { "name2" : 1};
   if (req.params.sort == "date")
      sort = { "dateAdded" : -1};
   else if (req.params.sort == "rate")
      sort = { "rating" : -1};
   else if (req.params.sort == "priceLtH")
      sort = { "price" : 1};
   else if (req.params.sort == "priceHtL")
      sort = { "price" : -1};

   console.log(sort);
   let query = rentModel.find({'category': req.params.category}).sort(sort).limit(25).skip((req.params.page-1)*25);
   query.exec( function(err,data) {
      if(err) 
         res.send(err);    
      res.json(data);
  });
}
//Get Item By ID
module.exports.getItemById = function(req, res) {
   rentModel.findById(req.params.id, function(err, data) {
      if (err)
         res.send(err);
      res.send(data);
   })
}
//Get Item By Owner ID
module.exports.getItemsByOwner = function(req, res) {
   rentModel.find({'ownerId':req.params.id},function(err,data){
      if(err) 
         res.send(err);    
      res.json(data);
  });
}
//Counts Items, TBD by Khanh
module.exports.countItems = function(req, res) {
   res.send('27');
}
//Search Items
module.exports.searchItems = function(req, res) {
   let key = req.params.key.toLowerCase();
   rentModel.find({'name2': { '$regex' : key} }, function(err, data) {
      if (err)
         res.send(err);
      res.json(data);
   })
}
//Add Review
module.exports.addReview = function(req, res) {
   rentModel.findById(req.params.id, function(err, data) {
      if (req.body) {
         if (data.aRating == 0)
            data.aRating += req.body.rating;
         else
            data.aRating = (data.aRating+req.body.rating)/2;
         data.reviews.push(req.body);
         data.save( function(err) {
            if (err)
               res.send(err);
            res.json(data);
         })
      }
   });
}