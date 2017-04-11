var mongoose = require ('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('BorrowItem',{
   ownerId: String,
   ownerName: String,
   otherId: String,
   otherName: String,

   name: String,
   category: String,
   quantity: String,
   state: String,
   description: String,
   pictures: {type: Schema.Types.Mixed},
   startDate: Date,
   endDate: Date,
});