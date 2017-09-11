'use strict';

var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../models/users');


module.exports = function (passport) {
	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		});
	});

	passport.use(new FacebookStrategy({
        clientID: '1220169278028018',
        clientSecret: '81dc8d4f6e13c40258c8e6a35f7a44dc',
        callbackURL: "https://nitelife-app.herokuapp.com/auth/facebook/callback",
        profileFields: ['id'],
        passReqToCallback: true,
        enableProof: true
      },
      function(req, token, tokenSecret, profile, done) {
      		console.log("Profile: ",profile);
            console.log("Token: ", token);
          //  console.log("TokenSecret: ", refreshToken);
        User.findOne({ facebookId: profile.id }, function (err, user) {
        	console.log("Insside model function");
            if(err){
        		throw err;
        	}

        	if(user){
        		console.log("There is already a user");
                console.log("reqUser: " + req.user);
               // req.user = user;
               /* req.login(user, function(err) {
                    if(err) {
                        return next(err);
                    }
                }); */
        	    return done(null, user);
        	}

                var user  = new User({
                facebookId: profile.id,
                previousSearch: ""
            });

            user.save(function(err){
                console.log("User has been saved");
                req.user = user;
                return done(err, user);
            });
          


        	
        });
      }
    ));
	

	
	
};
