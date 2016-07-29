var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Claimed = new Schema({
	userid: Schema.Types.ObjectId,
	stravaid: String,
	pinid: String,
	img: String,
	link: String,
	cost: Number,
},{
	timestamps: true
});

module.exports = mongoose.model('claimed', Claimed);