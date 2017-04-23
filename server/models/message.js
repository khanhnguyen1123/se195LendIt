var mongoose = require ('mongoose');
var Schema      = mongoose.Schema;
module.exports = mongoose.model('Message',{
   userId: String,
   userName: String,
   userImage: Schema.Types.Mixed,

   otherId: String,
   otherName: String,
   otherImage: Schema.Types.Mixed,

   other: String,

   messages : [
      {
         class: String,
         content: String,
         date: {type: Date, default: Date.now} 
      }
   ]
});