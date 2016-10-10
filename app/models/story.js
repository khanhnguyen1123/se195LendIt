var mongoose = require('mongoose');

var Schema = mongoose.Schema;

/************************************************************************
* SCHEMA
************************************************************************/
var StorySchema = new Schema({

	creator: { type: Schema.Types.ObjectId, ref: 'User' },
	content: String,
	created: { type: Date, defauly: Date.now}// create time and date that current user id login

});

module.exports = mongoose.model('Story', StorySchema);