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


