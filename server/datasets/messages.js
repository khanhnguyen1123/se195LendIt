var mongoose = require ('mongoose');
var Schema      = mongoose.Schema;
module.exports = mongoose.model('Message',{
	ownerId: String,
	ownerName: String,
	//ownerImage: String,

	receiverId: String,
	receiverName: String,
	
	subject: String,
	content: String,
	date: {type: Date, default: Date.now}
	
});