var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var mongoose = require('mongoose');
var User = require('../models/users');

passport.use(new LocalStrategy({
    usernameField: 'email'
  },
  function(username, password, done) {
    console.log("khanh trigger the LocalStrategy");
    User.findOne({ email: username }, function (err, user) {
      if (err) { return done(err); }
      // Return if user not found in database
      if (!user) {
        return done(null, false, {
          message: 'User not found'
        });
      }
      // Return if password is wrong
      if (!user.validPassword(password)) {
        return done(null, false, {
          message: 'Password is wrong'
        });
      }
      // If credentials are correct, return the user object
      return done(null, user);
    });
  }
));

// used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        console.log("khanh inside serializeUser "+user._id);
        done(null, user._id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(user, done) {
      console.log("khanh inside deserializeUser "+user._id);
        User.findById(user._id, function(err, user) {
            done(err, user);
        });
    });

// [k h a n h 001] adding facebook passport strategy
passport.use(new FacebookStrategy({
            
            clientID: '152440755213564',
           
            clientSecret: 'ae5ab34e3bea8355efb136431d6667b8',
            
            callbackURL: "http://localhost:5000/auth/facebook/callback",

            profileFields: ['id', 'emails', 'name'] //This
        },function(accessToken, refreshToken, profile, done) {
            console.log("khanh trigger the FacebookStrategy"+profile.id);
            process.nextTick(function () {
                User.findOne({'facebook.fbid': profile.id}, function (err, user) {
                    console.log(profile);
                    if (err) return done(err);
                    if (user) {
                        console.log(" Khanh find user in Lendit system,  no need to creat new user"+user );
                        var tk = user.generateJwt();
                        console.log(" Khanh find user in Lendit system,  generateJwt "+tk );
                        done(null, user);
                        
                    } else {
                        var user = new User();
                        
                        user.facebook.token = accessToken;
                        user.facebook.email = profile.emails[0].value;
                        user.facebook.fbid = profile.id;
                        user.facebook.displayName = profile.displayName;
                        //fixing duplicate
                        user.email=profile.emails[0].value;
                        user.name = profile.name.familyName +", "+profile.name.givenName;
                        
                        user.save(function (err) {
                            if (err) return done(err);
                            done(null, user);
                            console.log("khanh successfully save user from fb login "+user);
                        });
                    }
                });
            });
        }
    ));