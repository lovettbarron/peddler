var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// create User Schema
var User = new Schema({
  id: String, // Strava iD
  claimed: [{item_id: String, date: Date, cost: Number}], // Number of used pinterest pins
  yrlydist: Number,
  spent: Number,
  budget: Number,
  pin_username: String,
  pin_board: String
});

var Claimed = new Schema({
	userid: Schema.Types.ObjectId,
	stravaid: String,
	pinid: String,
	date: Date,
	img: String,
	link: String,
	cost: Number,
});

module.exports = mongoose.model('users', User);