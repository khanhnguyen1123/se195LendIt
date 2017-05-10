var mongoose = require( 'mongoose' );
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var Schema      = mongoose.Schema;

var userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
   // required: true
  },
  name: {
    type: String,
  //  required: true
  },
  profileImage:{
    type: Schema.Types.Mixed
  },
  address: String,
  billingAddress: String,
  phone: String,
  paypalAccount: String,
  aRating: Number,
  reviews : [Schema.Types.Mixed],
  hash: String,
  salt: String,
  newMessages: {type: Number,default: 0}, 
  lastViewMessageLenght: {type: Number,default: 0}, 
  currentlyRenting:[{
    itemId:String, 
    itemName: String, 
    itemImage:Schema.Types.Mixed, 
    itemDescription:String,
    itemEndDate:Date
  }],
  transactionHistory:[{
    paytype: String, 
    date: {type: Date, default: Date.now}, 
    amount: String, 
    itemName: String
  }],
  facebook: {
        fbid:{
            type: String,
            trim: true
        },
        token:{
            type: String
        },
        displayName:{
            type: String
        },
        email:{
            type: String
        }
        
    }
});

userSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

userSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
  return this.hash === hash;
};

userSchema.methods.generateJwt = function() {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    email: this.email,
    name: this.name,
    exp: parseInt(expiry.getTime() / 1000),
  }, "MY_SECRET"); // K H A N H testing !! should change this secret to env variables  
};

module.exports = mongoose.model('User', userSchema);