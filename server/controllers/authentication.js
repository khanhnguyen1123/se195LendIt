var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.register = function(req, res) {

  // if(!req.body.name || !req.body.email || !req.body.password) {
  //   sendJSONresponse(res, 400, {
  //     "message": "All fields required"
  //   });
  //   return;
  // }
  User.findOne({'email': req.body.email}, function (err, user) {
                    if(user){
                      console.log("User's email alraedy used. Please use different email to signup ");
                      res.status(404).json(err+" User's email alraedy uesed. Please use different email to signup");
                    }
                    else {
                      var user = new User();

                      user.name = req.body.name;
                      user.email = req.body.email;

                      user.setPassword(req.body.password);

                      user.save(function(err) {
                        var token;
                        token = user.generateJwt();
                        res.status(200);
                        res.json({
                          "token" : token
                        });
                      });

                    }//end else

              });

  

};

module.exports.login = function(req, res) {

  // if(!req.body.email || !req.body.password) {
  //   sendJSONresponse(res, 400, {
  //     "message": "All fields required"
  //   });
  //   return;
  // }

  passport.authenticate('local', function(err, user, info){
    var token;

    // If Passport throws/catches an error
    if (err) {
      res.status(404).json(err);
      return;
    }

    // If a user is found
    if(user){
     // console.log("found user k ha nh");
      token = user.generateJwt();
      res.status(200);
      res.json({
        "token" : token
      });
    } else {
      // If user is not found
      res.status(401).json(info);
    }
  })(req, res);

};