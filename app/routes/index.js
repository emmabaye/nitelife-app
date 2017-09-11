var UserController = require('../controllers/userController.js');

module.exports = function (app, passport) {

	var userController =  new UserController();

	function isLoggedIn (req, res, next) {
		if(req.isAuthenticated()) {
			return next();
		}else {
			res.redirect('/auth/facebook');
		}
	}

	app.get("/", function(req, res) {
		res.sendFile(process.cwd() + '/build/index.html');
	});

	app.get("/authStatus", function(req, res){ return res.json({authStatus: req.isAuthenticated()})});

	app.get('/getJSON', function(req, res){
		res.sendFile(process.cwd() + '/public/json/nightlife.json');
	});

	app.get('/search/:location', userController.getSearchVenues);

	app.get('/venueId', userController.getVenueId);

	app.post('/venueId',isLoggedIn, userController.postVenueId);

	app.get('/auth/facebook', passport.authenticate('facebook'));
    
    app.get('/auth/facebook/callback', 
      passport.authenticate('facebook', { failureRedirect: '/' }),
      function(req, res) {

        // Successful authentication, redirect home.
        res.redirect('/');
      });

    app.get('/logout', function(req, res){ req.logout(); res.redirect('/')});
}