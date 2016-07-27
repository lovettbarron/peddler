var express = require('express');
var app = express();

var defaults = require('./keys.js')

app.get('/', function (req, res) {
  
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
  console.log(defaults)
});