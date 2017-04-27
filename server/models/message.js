var mongoose = require ('mongoose');
var Schema      = mongoose.Schema;
module.exports = mongoose.model('Message',{
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
});