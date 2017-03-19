var mongoose = require ('mongoose');
var Schema      = mongoose.Schema;
module.exports = mongoose.model('RequestItem',{
	//Owner and Other Details
   ownerId: String,
   ownerName: String,
   otherId: String,
   otherName: String,
   //Item Details
   name: String,
   category: String,
   state: String,
   description: String,
   pictures: { type: Schema.Types.Mixed},
   //Backend Information
   name2: String,
   dateAdded: { type: Date, default: Date.now },
   lastUpdated: { type: Date, default: Date.now },
   address : {
      longitude : Number,
      latitude : Number
   },
   startDate: Date,
   endDate: Date,
});