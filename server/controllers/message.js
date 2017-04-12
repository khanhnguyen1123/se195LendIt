var mongoose = require('mongoose');
var User = mongoose.model('User');
require('../datasets/messages');
var Message = mongoose.model('Message');

// send message 
module.exports.send = function(req, res){
      //Creates a new message object from req.body
      var createMessage = new Message(req.body);
      //Save it into the DB.
      createMessage.save(function(err,item){
        if(err) res.send(err);
        //If no errors, send it back to the client

        res.status(200);
        res.json({
              "message" : "Send Message Successfully"
            });

      });
      
}; // end send message

// get all sended message 
module.exports.getSendMessages = function(req, res){
      //Creates a new message object from req.body
      Message.find({'ownerId':req.body._id},function(err,data){
      if(err) res.send(err);
        //If no errors, send it back to the client
      if(data){
        res.json(data);
      }
  }); // end Message.find      
}; // end get all sended message

// get all received messages 
module.exports.getReceievedMessages = function(req, res){
      //Creates a new message object from req.body
      Message.find({'receiverId':req.body._id},function(err,data){
      if(err) res.send(err);
        //If no errors, send it back to the client
      if(data){
        res.json(data);
      }
  }); // end Message.find      
}; // end get all received message

// delete message 
module.exports.delete = function(req, res){
      //Creates a new message object from req.body
      console.log("inside get all send message before exucute : "+ req.body._id+ " name "+ req.body.name);
      Message.findById(req.body._id,function(err,data){
      if(err) res.send(err);
        //If no errors, send it back to the client
      if(data){
        data.receiverId = null;
        data.save(function (err) {
          if (err)
            res.send(err);
          res.json({
              "message" : "Delete Message Successfully"
            });
        })
      }// end if (data)
  }); // end Message.find      
}; // end delete message

module.exports.getLength = function(req, res){
      //Creates a new message object from req.body
      
      User.findById(req.body._id,function(err,data){
      if(err) res.send(err);
        //If no errors, send it back to the client
      if(data){
        res.json(data);
      }  
      
  }); // end Message.find      
}; // end get lenght message

module.exports.updateLength = function(req, res){
      //Creates a new message object from req.body
      
      User.findById(req.body._id,function(err,data){
      if(err) res.send(err);
        //If no errors, send it back to the client
      if(data){
        data.lastViewMessageLenght = req.body.newLenght;
        data.save(function (err) {
          if (err)
            res.send(err);
          res.json({
              "message" : "update length Successfully"
            });
        })
      }// end if (data)
  }); // end Message.find      
}; // end update lenght message

