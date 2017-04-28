var mongoose = require('mongoose');
var User = mongoose.model('User');
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
   // check to update for renter item [not oworking yet]
   var item = {
      itemId: req.body._id,
      itemDescription: req.body.description
   };

   console.log("item id "+item.itemId+" description: "+item.itemDescription);
   User.update(
           { },
           { $pull: { 'currentlyRenting': { itemId: req.body._id } } },
           { multi: true }
         );
   
}// end update item
//Delete Item
module.exports.deleteItem = function(req, res) {
   rentModel.remove({_id: req.params.id}, function(err, data) {
      if (err)
         res.send(err);
      res.send("Item Delted Successfully");
   })
}
//Get All
module.exports.getAll = function(req, res) {
   let query = rentModel.find({});
   query.exec( function(err, data) {
      if (err)
         res.send(err);
      res.json(data);
   });
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
//Get top 10 recent Items
module.exports.getRecentItems = function(req, res) {
   let query = rentModel.find({}).sort({ "dateAdded" : -1}).limit(5);
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
//Counts All Items
module.exports.countItems = function(req, res) {
   let query = rentModel.find({}).count( function(err, data) {
      res.send(""+data);
   });
}
//Counts Items in a Category
module.exports.countItemsByCategory = function(req, res) {
   if (req.params.category == null)
      countItems(req,res);
   else {
      let query = rentModel.find({'category':req.params.category}).count( function(err, data) {
         res.send(""+data);
      });
   }
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
