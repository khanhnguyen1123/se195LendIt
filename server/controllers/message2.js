var mongoose = require('mongoose');
var User = mongoose.model('User');
require('../models/message2');
var Message = mongoose.model('Message2');

//TODO Test Message2 

/*
userId: String,
userName: String,
userImage: Schema.Types.Mixed,

otherId: String,
otherName: String,
otherImage: Schema.Types.Mixed,

messages : [
   {
      name: String,
      content: [String],
      date: {type: Date, default: Date.now} 
   }
]
*/
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
   Message.find( {'userId' : req.params.id}, function(err, data) {
      if (err)
         res.send(err);
      res.json(data);
   });
   
}

module.exports.deleteMessage = function (req, res) {
   //console.log(req.params.id);
   Message.remove({_id: req.params.id}, function(err, data) {
      if (err)
         res.send(err);
      res.send("Item Delted Successfully");
   })
}
/*
TODO Check Send, Check for Nonexisting document
req.body = {
   userId : some id
   otherId : some id
   userDoc : some id
   otherDoc : some id
   content : data
}
*/
module.exports.sendMessage = function (req, res) {
   //console.log(req.body);
   Message.findById(req.body._id, function(err, data) {
      if (err)
         res.send(err);
      data.messages = req.body.messages;
      console.log(data.messages);
      //console.log(data.messages)
      data.save( function(err2, data2) {
         if (err2)
            res.send(err2);
         //res.send(data2);
      })
      
   })
   User.findById(req.body.otherId, function(err, data) {
      if (err)
         res.send(err)
      if (data) {
         data.newMessages +=1;
         data.save( function(err2, data2) {
            if (err2)
               res.send(err2);
            //res.send(data2);
         })
      }
   })
   Message.findById(req.body.other, function(err, data) {
      if (err)
         res.send(err);
      if (data) {
         let temp = req.body.messages.splice(-1)[0];
         temp.class = "convOther";
         data.messages.push(temp);
         data.save( function( err2, data2) {
            if (err2)
               res.send(err2);
         });

      } else {
         let temp = {
            'userId' : req.body.otherId,
            'userName' : req.body.otherName,
            'userImage' : req.body.otherImage,

            'otherId' : req.body.userId,
            'otherName' : req.body.userName,
            'otherImage' : req.body.userImage,

            'other' : req.body._id,

            'messages' : [{
               'class' : 'convOther',
               'content' : req.body.messages.splice(-1)[0].content,
               'date' : new Date()
            }]
         };
         let newMessage = new Message(temp);
         newMessage.save( function(err2, data2) {
            if (err2)
               res.send(err2);
            Message.findById(req.body._id, function(err3, data3) {
               if (err3)
                  res.send(err3);
               data3.other = data2._id;
               data3.save( function(err4, data4) {
                  if (err4)
                     res.send(err4)
                  res.send(data4);
               })
            })
         })
      }

   })
}
//Pass req.body.content
module.exports.newMessage = function(req, res) {
   
   //Updates New Message Count for User
   User.findById(req.body.userId, function(err,data) {
      if (err)
         res.send(err);
      data.newMessages += 1;
      data.save( function(err2, data2) {
         if (err2)
            res.send(err);
      })
   });

   let userMessage = new Message(req.body);
   //Create Message For User
   userMessage.save( function(err, data) {
      if (err)
         res.send(err);
      //Switches Users
      let tempId = req.body.userId;
      let tempName = req.body.userName;
      let tempImage = req.body.userImage;
      req.body.userId = req.body.otherId;
      req.body.userName = req.body.otherName;
      req.body.userImage = req.body.otherImage;
      req.body.otherId = tempId;
      req.body.otherName = tempName;
      req.body.otherImage = tempImage;
      req.body.messages[0].class = "convOther";
      req.body.other = data._id;
      let otherMessage = new Message(req.body);
      otherMessage.save( function(err, data2) {
         if (err)
            res.send(err)
         data.other = data2._id;
         data.save( function(err, data) {
            if (err)
               res.send(err);
            res.json(data);
         })
      })
   });
   
}