exports.index = function(req, res){

	strava.athlete.get({},function(err,payload) {
            if(!err) {
                console.log(payload);
            }
            else {
                console.log(err);
            }
        });







	
  res.render('index', {
    title: 'HTML5 ✰ Boilerplate', 
    description: 'Description',
    author: 'Author'
  });
};