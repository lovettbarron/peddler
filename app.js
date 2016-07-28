
// var defaults = require('./keys.js') || ""
// use Setup a shell script to run
// ##!/bin/bash
// heroku config:set STRAVA_CLIENT_ID=
// heroku config:set STRAVA_CLIENT_SECRET=
// heroku config:set STRAVA_ACCESS_TOKEN=
//

var express = require('express')
    , morgan = require('morgan')
    , bodyParser = require('body-parser')
    , methodOverride = require('method-override')
    , app = express()
    , port = process.env.PORT || 3000
    , router = express.Router()
    , passport = require('passport')
    , StravaStrategy = require('passport-strava-oauth2').Strategy
    , strava = require('strava-v3')
    , pinterest = require('pinterest-api')
    , mongoose = require('mongoose');

app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'jade');
app.use(morgan('dev'));  
app.use(bodyParser());   
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride());                  
var pin = pinterest("readywater");

// Mongoose
var User = require('./User.js');
mongoose.connect('mongodb://localhost/peddler-test');


// STRAVA METHODS (Auth and passport)
passport.serializeUser(function(user, done) {
	console.log(user)
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
});

passport.use(new StravaStrategy({
    clientID: process.env.STRAVA_CLIENT_ID,
    clientSecret: process.env.STRAVA_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/callback"
  },
   // function(accessToken, refreshToken, profile, cb) {
   //  User.findOrCreate({ stravaId: profile.id }, function (err, user) {
   //    return cb(err, user);
   //  });
  function(accessToken, refreshToken, profile, done) {
    User.findOneAndUpdate(
    		{id:profile.id}, 
    		{id:profile.id}, 
    		{upsert:true}, function(err, user) {
      if(err) {
        return done(err);
      } else {
        return done(null, user);
      }
    });
    // process.nextTick(function () {
    //   return done(null, profile);
    // });
  }
));

app.use('/auth',
  passport.authenticate('strava'));

app.use('/auth/callback', 
  passport.authenticate('strava', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
});

// Main index
app.use('/', function(req, res, next) {
	console.log(req.passport)
	  if (req.user == undefined) {
            res.redirect('/login');
        } else {
            res.render('auth');
            console.log(req.user)
        }
});

app.use('/login', function(req, res, next) {
	console.log(req.passport)
	  if (req.user == undefined) {
            res.render('auth');
        } else {
            res.redirect('/');
        }
});


app.use('/user',function(req,res,next){
	 strava.athletes.stats({id:req.user},function(err,payload) {
            if(!err) {
                console.log(payload);
                res.setHeader('Content-Type', 'application/json');
		    	res.send(JSON.stringify(payload))
            }
            else {
                console.log(err);
            }
        });
})

// PINTEREST
app.use('/items',function(req, res, next) {
	
	pin.getPinsFromBoard("ayla-bikes", true, function (pins) {
		var keys = []

		for (var v in pins.data) {
			keys.push(pins.data[v].id)
		}

		// console.log(keys)

		pinterest.getDataForPins(keys,function(data) {
			var items = []
			// Yeah... rewrite this
			for (var v in data.data) {
				var obj = {}
				var o = data.data[v]
				if(o.rich_metadata == null) continue

				obj.id = o.id ? o.id : ""
				obj.img = o.images["237x"].url ? o.images["237x"].url : ""
				obj.link = o.link ? o.link : ""
				obj.price = o.rich_metadata ? o.rich_metadata.products[0].offer_summary.price : "$100"
			
				console.log(obj)
				items.push(obj)
			}


			res.setHeader('Content-Type', 'application/json');
	    	res.send(JSON.stringify(items))
		})

    	console.log(pins)
    	
	});
})


app.listen(port);
console.log('App running on port', port);