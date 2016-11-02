var mongoose = require ('mongoose');
var Schema      = mongoose.Schema;
module.exports = mongoose.model('RequestedItem',{
	ownerId: String,
	ownerName: String,
	renterId: String,
	name: String,
	//category: [{nameCategory: String}],
	category: String,
	price: String,
	quantity: String,
	state: String,
	description: String,
	picture: {type: Schema.Types.Mixed},
    morePictures: Schema.Types.Mixed,
	startDate: Date,
	endDate: Date,
	
});