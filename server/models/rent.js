var mongoose = require ('mongoose');
var Schema      = mongoose.Schema;
module.exports = mongoose.model('RentItem',{
	//Owner and Other Details
   ownerId: String,
   ownerName: String,
   otherId: String,
   otherName: String,
   //Item Details
   name: String,
   category: String,
   state: String,
   price: Number,
	priceOption: String,
	quantity: Number,
   description: String,
   pictures: { type: Schema.Types.Mixed},
   //Rating and Reviews
   aRating : Number,
   reviews : [],
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