var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports.profileRead = function(req, res) {

  console.log("khanh test inside profile "+req.payload.email+"  khanh "+req.payload._id+ " khanh "+req.body);

  if (!req.payload._id) {
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
