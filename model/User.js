var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// create User Schema
var User = new Schema({
  id: String, // Strava iD
  claimed: Number, // Number of used pinterest pins
  yearly_goal: {type:Number,default: 4000},
  monthly_budget: {type:Number,default: 100},
  pin_username: String,
  pin_board: String
});

module.exports = mongoose.model('users', User);