var mongoose = require ('mongoose');
var Schema      = mongoose.Schema;
module.exports = mongoose.model('LendingItem',{
	ownerId: String,
	ownerName: String,
	renterId: String,
	renterName: String,

	name: String,
	category: String,
	price: Number,
	priceOption: String,
	quantity: Number,
	state: String,
	description: String,
	pictures: {type: Schema.Types.Mixed},
	startDate: Date,
	endDate: Date,
	
});