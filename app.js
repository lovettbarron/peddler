
// var defaults = require('./keys.js') || ""
// use Setup a shell script to run
// ##!/bin/bash
// heroku config:set STRAVA_CLIENT_ID=
// heroku config:set STRAVA_CLIENT_SECRET=
// heroku config:set STRAVA_ACCESS_TOKEN=
//

var express = require('express')
	, connect = require('connect')
	, sessions = require('express-session')
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
app.use(sessions({ secret: 'shutuplegs' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride());                  
var pin = pinterest("readywater");

// Mongoose
var User = require('./model/User.js');
var Claimed = require('./model/Claimed.js')
mongoose.connect('mongodb://localhost/peddler-test');


// STRAVA METHODS (Auth and passport)
passport.serializeUser(function(user, done) {
	console.log("serializeUser")
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
  }, function(accessToken, refreshToken, profile, done) {
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
  passport.authenticate('strava', { 
  	failureRedirect: '/login' }),
  function(req, res) {
  	 User.findOneAndUpdate(
    		{id:req.user.id}, 
    		{id:req.user.id,
    		pin_username: req.session.pinid,
    		pin_board: req.session.pinboard
    		}, 
    		{upsert:false}, function(err,user){
    			if(err) {
    				console.log("Failed to assoc pinterest w/ strava")
    				res.redirect('/logout')
    			}
    		})

    res.redirect('/');
});

function authenticationMiddleware() {  
  return function (req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/login')
  }
}

// Main index
app.get('/', authenticationMiddleware(), function(req, res, next) {
	// console.log("Rendering index")
	console.log(req.session.pinid)
	console.log(req.session.pinboard)
    res.render('index');
    // console.log(req.user)
});

app.get('/login', function(req, res, next) {
	// console.log(req.user)
    res.render('auth');
});


app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

//////////////////////////////////
////////////// USER //////////////
//////////////////////////////////
app.get('/user',function(req,res,next){

	// Grab the user info from the db
	User.find({id:req.user.id}, function(err,user) {
		console.log("User obj",user)
		// Query strava with updated info
		 strava.athletes.stats({id:req.user.id},function(err,payload) {
		    if(!err) {
		        // console.log(payload);

		        var obj = {}
		        obj.id = req.user.id
		        obj.yearly_km = payload.ytd_ride_totals.distance/1000
		        obj.budget = user.budget
		        obj.claimed = user.items

		        // Update user w/ new distance
				User.findOneAndUpdate(
					{id:req.user.id}, 
					{
					 yrlydist: payload.ytd_ride_totals.distance//1000
					}, 
					{upsert:false}, function(err,user){
						if(err) {
							console.log("Failed to update distance")
							res.redirect('/logout')
						} else {
							console.log("Obj to send",obj)
							res.setHeader('Content-Type', 'application/json');
					    	res.send(JSON.stringify(obj))
						}
					})
		    }
		    else {
		        console.log("Strava fail",err);
		    }
		});
	 })
})

// PINTEREST
app.get('/user/pin-exist',function(req,res,next){
	var p = pinterest(req.query.user)
	var b = []
	p.getBoards(true, function(boards) {
		console.log(boards.data)
		for(var v in boards.data) {
			
			// if(!boards[v]) continue
			b.push(String(boards.data[v].href).split('/')[2])
		}
		res.setHeader('Content-Type', 'application/json');
    	res.send(JSON.stringify(b))
	})
})

app.put('/user/pin-config',function(req,res,next) {
	req.session.pinid = req.query.user
	req.session.pinboard = req.query.board
	res.sendStatus(200)
})

//////////////////////////////////////
/////////////  Items  ////////////////
//////////////////////////////////////

app.get('/items/claim',function(req,res,next){
	console.log("req.user",req.user)
	console.log("req.session",req.session)

	Claimed.findOneAndUpdate(
	{id:req.query.pinid}, 
		{userid: req.user._id,
		 stravaid: req.user.id,
		 pinid: req.query.pinid, 
		 link: req.query.link,
		 cost: req.query.cost,
		 img: req.query.img
		},
		{safe: true, upsert:true}, function(err,user){
			if(err) {
				console.log("claim fail :(",err)
				res.sendStatus(500)
			} else {
				console.log("Claim success",user)
				res.sendStatus(200)
			}
	})		
})


app.get('/items', function(req, res, next) {
	var items = []

	User.find({id:req.user.id}, function(err,user) {
		if(err) {
			console.log("Some kind of error fetching pins",err)
			res.sendStatus(400,err)
		}
		console.log("Returned user",user[0])
		var p = pinterest(user[0].pin_username)

	p.getPinsFromBoard(user[0].pin_board, true, function (pins) {
		var keys = []

		for (var v in pins.data) {
			keys.push(pins.data[v].id)
		}

		pinterest.getDataForPins(keys,function(data) {
			
			// Yeah... rewrite this
			for (var v in data.data) {
				var obj = {}
				var o = data.data[v]
				if(o.rich_metadata == null) continue

				obj.id = o.id ? o.id : ""
				obj.img = o.images["237x"].url ? o.images["237x"].url : ""
				obj.link = o.link ? o.link : ""

				var price = o.rich_metadata.products[0].offer_summary.price

				// Adjust for the aussies only for now
				var price_adjust = price.split("$")[0] == "A" ? price.split("$")[1] * .75 : price.split("$")[1] 

				obj.price = price_adjust
			
				console.log(obj)
				items.push(obj)
			}

			res.setHeader('Content-Type', 'application/json');	
	    	res.send(JSON.stringify(items))
			})    	
		});
	})
})

app.get('/claimed', function(req, res, next) {
	var claim = []
	console.log("CLAIMED req.user",req.user)
	console.log("CLAIMED req.session",req.session)
	Claimed.find(
		{userid:req.user._id}, 
		function(err,claimed){
			if(err) {
				console.log("claim find fail :(",err)
				console.log("claimed failed outcome",claimed)
				res.sendStatus(400)
			} else {
				console.log("Claim find success",claimed)
				res.setHeader('Content-Type', 'application/json');	
				res.send(JSON.stringify(claimed))
			}
	})		

	
});

app.listen(port);
console.log('App running on port', port);