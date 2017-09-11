'use strict';
var fetch = require('node-fetch');
var User = require('../models/users.js');
var Venue = require('../models/venues.js');
require('dotenv').load();

var clientID = process.env.FOURSQUARE_ID;
var clientSecret = process.env.FOURSQUARE_SECRET;
var url = "https://api.foursquare.com/v2/venues/explore?near=New%20York&limit=20&"+
"venuePhotos=1&section=nightlife&client_id="+ clientID +"&client_secret=" + clientSecret + "&v=20160826&m=swarm"
console.log(url)


function UserController() {

	// GET  get venues
	this.getSearchVenues = function(req, res, next) {
		console.log(clientID);
		console.log(clientSecret);
		console.log("Ready")
		fetch("https://api.foursquare.com/v2/venues/explore?" + 
			"near=" + req.params.location + "&limit=20&" +
			"venuePhotos=1&section=nightlife&client_id="+ 
			clientID +"&client_secret=" + clientSecret + "&v=20160826&m=swarm"

)
			.then(function(res){
				console.log("Gotten");
				return res.json();
			}).then(function(json){
				console.log("JSON ", json)
				console.log(json.response.groups[0].items[0].venue.url);
				res.json(json.response.groups[0].items);
			}).catch(function(e){
				console.log("ERROR", e);
				res.json({error: "Sorry, there was an error in fetching the data. Try a correct search term"})
			});
	}


	//GET the number of persons going to a venue
	this.getVenueId = function(req, res, next){
		console.log("Get venueid body ", req.query);

		Venue.findOne({'id': req.query.venueId}, function(err, venue){
			if(err){
				throw err;
			}

			if(!venue){
				return res.json({
					going: "0",
					venueId: req.body.venueId
				});
			}

			if(venue){
				return res.json({
					going: venue.going.length,
					venueId: req.body.venueId
				});
			}
		})

	}

	// POST id of venue user is going to
	this.postVenueId = function(req, res, next) {
		console.log("POSTING VENUE");
		console.log('BODY: ', req.body);
		/*if(!req.isAuthenticated()){
			console.log("user is not authenticated, redirecting...")
			return res.redirect('/auth/facebook');
		}
		*/

		User.findOne({'facebookId': req.user.facebookId}, function(err, user){
			if(err){
				throw err;
			}

			user.previousSearch = "My Previous Search";
			user.save(function(err){
				if(err){
					throw err;
				}
			});
		});

		Venue.findOne({'id': req.body.venueId}, function(err, venue){
			if(err){
				throw err;
			}

			if(!venue){
				var newVenue = new Venue({
					id: req.body.venueId,
					going: [{id: req.user.facebookId}]
				});

				newVenue.save(function(err){
					if(err){
						throw err;
					}
					console.log("This is a new venue and you are now going to it")
					console.log("Number of users going: ", newVenue.going.length);
					return res.json({
						going: 1,
						venueId: req.body.venueId
					});
				});
			} else if(venue){
				/*if(venue.going.length == 0){
					venue.going.push({id: req.body.facebookId});
					return venue.save(function(err){
						if(err){
							throw err;
						}
						console.log("This venue already existed but no one was going to it, you are now going to it")
						return res.json({
							going: 1,
							venueId: req.body.venueId
						});
					});
				} */

				for(var i=0; i < venue.going.length; i++){
					var user = venue.going[i];
					//if user is already going to venue remove him
					if(user.id == req.user.facebookId){
						console.log(user);
						console.log("VENUE  ",venue);
						console.log("\nInitial number of users going: ", venue.going.length)
						console.log("Venue already exists with you in it, so you will be removed");
						console.log(user);
						venue.going.pull(user);
						console.log(venue.going);

						return venue.save(function(err){
							if(err){
								throw err;
							}
							console.log("You have been removed from this venue");
							console.log("Final number of users now going: ", venue.going.length);
							return res.json({
								going: venue.going.length,
								venueId: req.body.venueId
							});
						});
					}
				};

				// User  wasn't  going to venue, so add him
				console.log("\nInitial Number of users going: ", venue.going.length);
				venue.going.push({id: req.user.facebookId});

				
				return venue.save(function(err){
					if(err){
						throw err;
					}
					console.log("Venue already exists,You are now going to this venue");
					console.log("Final number of users now going: ", venue.going.length);
					return res.json({
						going: venue.going.length,
						venueId: req.body.venueId
					});
				});

	
			}
			
		});
	}



}

module.exports = UserController;
