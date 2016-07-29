var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// create User Schema
var User = new Schema({
  id: String, // Strava iD
  yrlydist: Number,
  yearly_goal: Number,
  claimed: Number,
  monthly_budget: Number,
  pin_username: String,
  pin_board: String
},{
	timestamps: true
});

User.pre('save', function preSave(next){
  var something = this;
  something.last_login(Date.now());
  next();
});

module.exports = mongoose.model('users', User);