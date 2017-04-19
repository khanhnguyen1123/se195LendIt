var mongoose = require ('mongoose');
var Schema      = mongoose.Schema;
module.exports = mongoose.model('Message',{
   ownerId: String,
   ownerName: String,
   ownerImage: Schema.Types.Mixed,

   receiverId: String,
   receiverName: String,
   receiverImage: Schema.Types.Mixed,

   subject: String,
   content: String,
   date: {type: Date, default: Date.now},
   receiverReply:   [
      {
         image:Schema.Types.Mixed, 
         name:String, content:String, 
         date: {type: Date, default: Date.now} 
      }],
   ownerReply: [
      {
         image:Schema.Types.Mixed, 
         name:String, 
         content:String, 
         date: {type: Date, default: Date.now} 
      }]
});