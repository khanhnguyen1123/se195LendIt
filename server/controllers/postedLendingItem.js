var mongoose = require('mongoose');
//var User = mongoose.model('User');
//var LendingItem = mongoose.model('LendingItem');
var LendingItem = require('../datasets/lendingItems.js');

// post Lending item
module.exports.post = function(req, res){
      //Creates a new superhero
      var newLendingItem = new LendingItem(req.body);
      //Save it into the DB.
      newLendingItem.save(function(err){
        if(err) res.send(err);
        //If no errors, send it back to the client
        res.json(req.body);

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
};