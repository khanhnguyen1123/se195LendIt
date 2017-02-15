var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports.profileRead = function(req, res) {

  console.log("khanh test inside profile "+req.payload.email+"  khanh "+req.payload._id+ " khanh "+req.body);

  if (!req.payload._id) {
      console.log("khanh Req.payload._id is not exist in side profileRead"+req.payload._id);
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
    User
      .findById(req.payload._id)
      .exec(function(err, user) {
        res.status(200).json(user);
        console.log(user);
      });
  }

};

module.exports.updatePhoto= function(req,res){
  var userId = req.body._id;
  console.log('khanh in side update photto  :'+req.body._id);
  var image = req.body.profileImage;
  User.findById(userId, function(err, userData){
                var user = userData;
                user.profileImage = image;
                user.save(function(err){
                    if (err){
                        console.log("failed save")
                        res.json({status: 500})
                    } else {
                        console.log("save successful");
                        
                        res.json({status: 200})
                    }
                })
            });
};

module.exports.editProfile= function(req,res){
  var userId = req.body._id;
  User.findById(userId,function(err,userData){
                var user = userData;
                if (req.body.name) user.name = req.body.name;
                if (req.body.address) user.address = req.body.address;
                if (req.body.phone) user.phone = req.body.phone;
                if (req.body.billingAddress) user.billingAddress = req.body.billingAddress;
                if (req.body.paypalAccount) user.paypalAccount = req.body.paypalAccount;
              /* 
                if (req.body.email) {
                  User.findOne({'email': req.body.email}, function (err, user) {
                    if(user){
                      console.log("User's email alraedy used. Please use different email to signup ");
                      res.status(404).json(err+" User's email alraedy uesed. Please use different email to signup");
                    }
                     
                  }) 
                  user.email = req.body.email;
                }
              */
                user.save(function(err){
                    if (err){
                        console.log("failed save")
                        res.json({status: 500})
                    } else {
                        console.log("save successful");
                        
                        res.json({status: 200})
                    }
                })


            });
}; // end editProfile module

module.exports.getOne = function(req,res){
  User
      .findById(req.params.id)
      .exec(function(err, user) {
        res.status(200).json(user);
        
      });

}; // end getOne function
