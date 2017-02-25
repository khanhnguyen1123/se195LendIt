var mongoose = require('mongoose');
var User = mongoose.model('User');
var BorrowItem = require('./borrow.model.js');

//Comment for Albert, Limit and Skip

//Create Item
module.exports.createItem = function(req, res) {
   let newItem = new BorrowItem(req.body);
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
         user.borrowedItem.push({lendingItemId: itemId});
         user.save();
      });
}

//Update Item
module.exports.updateItem = function(req, res) {
   BorrowItem.findById(req.body._id, function(err, data) {
      let item = req.body;
      item.save(function(err) {
         if (err) {
            console.log("Borrow Item Failed Update");
            res.json({status: 500});
         } else {
            console.log("Borrow Item Successfully Updated")
            res.json({status: 200});
         }
      });
   });
}

//Delete Item
module.exports.deleteItem = function(req, res) {

}



//Read Item
module.exports.readItem = function(req, res) {

}
//Read Item By ID
module.exports.readItemById = function(req, res) {

}
//Read Item By Owner ID
module.exports.readItemByOwner = function(req, res) {

}
//Read Item By Category
module.exports.readItemByCategory = function(req, res) {

}
//Read Item By Date Ascending Order
module.exports.readItemByDateAsc = function(req, res) {

}
//Read Item By Date Descending Order
module.exports.readItemByDateDesc = function(req, res) {

}
//Read Item By Rating Ascending Order
module.exports.readItemByRatingAsc = function(req, res) {

}
//Read Item By Rating Descending Order
module.exports.readItemByRatingDesc = function(req, res) {

}