'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var UsersGoingSchema = new Schema({
	id: String
});

var VenueSchema = new Schema({
	id: {type: String, unique: true},
	going: [UsersGoingSchema]
});

module.exports = mongoose.model("Venue", VenueSchema);