var mongoose = require ('mongoose');
var Schema      = mongoose.Schema;
module.exports = mongoose.model('LendingItem',{
	ownerId: String,
	ownerName: String,
	renterId: String,
	name: String,
	//category: [{nameCategory: String}],
	category: String,   // book & audible, electronics & computers, home garden & tools, movies music & games, private parking, sports and outdoor, other 
	price: String,
	quantity: String,
	state: String,
	description: String,
	picture: {type: Schema.Types.Mixed},
    morePictures: Schema.Types.Mixed,
	startDate: Date,
	endDate: Date,
	
});