var mongoose = require('mongoose');
var User = mongoose.model('User');
require('../models/message');
var Message = mongoose.model('Message');

/*
users : [
   {
      userId: String,
      userName: String,
      userImage: String,
      userView: {type: Boolean, default: true}
   }
],
messages : [
   {
      name: String,
      content: String,
      date: {type: Date, default: Date.now} 
   }
]
*/
//Gets the Count of New Messages
module.exports.getNewMessages = function(req, res) {
   User.findById(req.params.id, function(err, data) {
      if (err)
         res.send(err)
      res.send(""+data.newMessages);
   })
}
//Gets all message for a given user id
module.exports.getMessages = function (req, res) {
   User.findById(req.params.id, function(err, data) {
      if (err)
         res.send(err);
      data.newMessages = 0;
      data.save( function(err2, data2) {
         if (err2)
            res.send(err2)
      })
   })
   let user = {
      'userId' : req.params.id,
      'userView': true
   }
   Message.find( {'users' : { '$elemMatch' : user}}, function(err, data) {
      if (err)
         res.send(err);
      res.json(data);
   });
   
}
//Deletes message for a given user id
module.exports.deleteMessage = function (req, res) {
   Message.findById(req.params.id, function(err, data) {
      if (err)
         res.send(err);
      let changed = false;
      for (let i=0; i<data.users.length; i++) {
         if (req.body.userId && data.users[i].userId == req.body.userId) {
            data.users[i].userView = false;
            changed = true;
         }
      }
      if (changed)
         data.save( function(err2, data2) {
            if(err2)
               res.send(err2)
            res.json(data2);
            console.log("After Delete");
            console.log(data2);
         })
   })
}
module.exports.sendMessage = function (req, res) {
   Message.findById(req.body._id, function(err, data) {
      if (err)
         res.send(err);
      let newMessage = {
         'name' : req.body.name,
         'content' : req.body.content,
      }
      data.messages.push(newMessage);
      for (let i=0; i<data.users.length; i++) {
         data.users[i].userView = true;
      }
      data.save( function(err2, data2) {
         if (err2)
            res.send(err2)
         res.json(data2);
      })
   })
   incrementUserMessageCount(req.body.other);
}

module.exports.newMessage = function(req, res) {
   let newMessage = new Message(req.body);
   newMessage.save( function(err, data) {
      if (err)
         res.send(err);
      res.json(data);
   })  
   incrementUserMessageCount(req.body.other); 
}

function incrementUserMessageCount (id) {
   User.findById(id, function(err,data) {
      if (err)
         res.send(err);
      data.newMessages += 1;
      data.save( function(err2, data2) {
         if (err2)
            res.send(err);
      })
   })
}