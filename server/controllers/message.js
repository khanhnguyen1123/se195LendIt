var mongoose = require('mongoose');
var User = mongoose.model('User');
require('../datasets/messages');
var Message = mongoose.model('Message');

// send message 
module.exports.send = function(req, res){

  User.findById(req.body.ownerId, function(err, userData){
    req.body.ownerImage = userData.profileImage;
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
  });// end find user
      
      
}; // end send message

// reply message 
module.exports.reply = function(req, res){

  User.findById(req.body.ownerId, function(err, userData){
    
      var re = {
        name: req.body.ownerName,
        content: req.body.content,
        image: userData.profileImage
      }
      Message.findById(req.body._id,function(err,data){
          if(err) res.send(err);
            //If no errors, send it back to the client
          if(data){
            // checking owner for this reply message
            if(data.ownerName == req.body.ownerName){
              data.ownerReply.push(re);
            }
            else{
              data.receiverReply.push(re);
            }// end checking owner for this reply message

            data.save(function (err) {
              if (err)
                res.send(err);
              res.json({
                  "message" : "send reply Message Successfully"
                });
            })
          }// end if (data)
      }); // end Message.find
  });// end find user
      
}; // end reply message

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

// get new length of message [need user id]
module.exports.getNewLengthMessage = function(req, res){
      var newLenght=0;
  // get length from received messages
      Message.find({'receiverId':req.body._id},function(err,data){
          if(err) res.send(err);
            //If no errors, send it back to the client
          if(data){
            newLenght = data.length;
            for (var i =0;i<data.length;i++){
              
              newLenght += data[i].ownerReply.length;
            }// end for loop
            // get length from owner message
            Message.find({'ownerId':req.body._id},function(err,datai){
                if(err) res.send(err);
                  //If no errors, send it back to the client
                if(datai){
                  for (var i =0;i<datai.length;i++){
                    
                    newLenght += datai[i].receiverReply.length;
                  }// end for loop
                  
                  res.json({
                    "newLengthMesage" : newLenght
                  });
                }
            }); // end Message.find

          }// end if data
      }); // end Message.find 
      
      
}; // end get new length of message