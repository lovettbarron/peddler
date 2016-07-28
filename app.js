
// var defaults = require('./keys.js')
var express = require('express')
    , morgan = require('morgan')
    , bodyParser = require('body-parser')
    , methodOverride = require('method-override')
    , app = express()
    , port = process.env.PORT || 3000
    , router = express.Router()
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

app.use('/user',function(req,res,next){
	strava.athlete.get({},function(err,payload) {
            if(!err) {
                console.log(payload);
            }
            else {
                console.log(err);
            }
        });
})

app.use('/get_pins',function(req, res, next) {
	
	pin.getPinsFromBoard("ayla-bikes", true, function (pins) {
    	console.log(pins)
    	res.setHeader('Content-Type', 'application/json');
    	res.send(JSON.stringify(pins))
	});
})

app.listen(port);
console.log('App running on port', port);