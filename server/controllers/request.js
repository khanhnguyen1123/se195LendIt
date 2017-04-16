var mongoose = require('mongoose');
var requestModel = require('../models/request');

//Create Item
module.exports.createItem = function(req, res) {
   let newItem = new requestModel(req.body);
   newItem.name2 = req.body.name.toLowerCase();
   //Saves Item to DB
   newItem.save(function(err, data) {
      if(err)
         res.send(err);
      res.json(req.body);
   });
}
//Update Item
module.exports.updateItem = function(req, res) {
   req.body.lastUpdated = new Date();
   req.body.name2 = req.body.name.toLowerCase();
   requestModel.update({_id: req.body._id}, req.body, function(err) {
      if (err)
         res.send(err);
      res.send("Item Update Successfully");
   })
}
//Delete Item
module.exports.deleteItem = function(req, res) {
   requestModel.remove({_id: req.params.id}, function(err, data) {
      if (err)
         res.send(err);
      res.send("Item Delted Successfully");
   })
}
//Gets All Items
module.exports.getAll = function(req, res) {
   let query = requestModel.find({});
   query.exec(function(err, data) {
      if (err)
         res.send(err);
      res.json(data);
   })
}
//Get Item
module.exports.getItems = function(req, res) {
   let sort = { "name2" : 1};
   if (req.params.sort == "date")
      sort = { "dateAdded" : -1};

   let query = requestModel.find({}).sort(sort).limit(25).skip((req.params.page-1)*25);
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

   let query = requestModel.find({'category': req.params.category}).sort(sort).limit(25).skip((req.params.page-1)*25);
   query.exec( function(err,data) {
      if(err) 
         res.send(err);    
      res.json(data);
  });
}
//Get Item By ID
module.exports.getItemById = function(req, res) {
   requestModel.findById(req.params.id, function(err, data) {
      if (err)
         res.send(err);
      res.send(data);
   })
}
//Get Item By Owner ID
module.exports.getItemsByOwner = function(req, res) {
   requestModel.find({'ownerId':req.params.id},function(err,data){
      if(err) 
         res.send(err);    
      res.json(data);
  });
}
//Counts All Items
module.exports.countItems = function(req, res) {
   let query = requestModel.find({}).count( function(err, data) {
      res.send(""+data);
   });
}
//Counts Items in a Category
module.exports.countItemsByCategory = function(req, res) {
   if (req.params.category == null)
      countItems(req,res);
   else {
      let query = requestModel.find({'category':req.params.category}).count( function(err, data) {
         res.send(""+data);
      });
   }
}
//Search Items
module.exports.searchItems = function(req, res) {
   let key = req.params.key.toLowerCase();
   requestModel.find({'name2': { '$regex' : key} }, function(err, data) {
      if (err)
         res.send(err);
      res.json(data);
   })
}
//Add Review
module.exports.addReview = function(req, res) {
   requestModel.findById(req.params.id, function(err, data) {
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