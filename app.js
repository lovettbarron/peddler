
// var defaults = require('./keys.js')
var express = require('express')
    , morgan = require('morgan')
    , bodyParser = require('body-parser')
    , methodOverride = require('method-override')
    , app = express()
    , port = process.env.PORT || 3000
    , router = express.Router()
    , passport = require('passport')
    , StravaStrategy = require('passport-strava-oauth2')
    , strava = require('strava-v3')
    , pinterest = require('pinterest-api');

    var pin = pinterest("readywater");

app.use(express.static(__dirname + '/views')); // set the static files location for the static html
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users
app.set('view engine', 'jade');
app.use(morgan('dev'));                     // log every request to the console
app.use(bodyParser());                      // pull information from html in POST
app.use(methodOverride());                  // simulate DELETE and PUT

app.get('/', function(req, res, next) {
    res.render('index');
});

// STRAVA METHODS

passport.use(new StravaStrategy({
    clientID: STRAVA_CLIENT_ID,
    clientSecret: STRAVA_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/strava/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      return done(null, profile);
    });
  }
));

app.get('/auth',
  passport.authenticate('strava'));

app.get('/auth/callback', 
  passport.authenticate('strava', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
});





// app.use('/auth',function(req,res,next){
// 	res.redirect(strava.oauth.getRequestAccessURL({scope:"view_private"}))
// })

// app.use('/token_exchange',function(req,res,next){
// 	strava.oauth.getToken(code,function(err,payload) {
// 	  console.log(payload);
// 	})
// })

app.use('/user',passport.authenticate('strava', { session: false }),function(req,res,next){
	 strava.athletes.stats({},function(err,payload) {
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

		console.log(keys)

		pinterest.getDataForPins(keys,function(data) {
			res.setHeader('Content-Type', 'application/json');
	    	res.send(JSON.stringify(data))
		})

    	console.log(pins)
    	
	});
})


app.listen(port);
console.log('App running on port', port);