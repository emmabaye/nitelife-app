'use strict';

var mongoose = require('mongoose');
var Schema =  mongoose.Schema;

var UserSchema =  new Schema({
	facebookId: {type: String, unique: true},
	previousSearch: {type: String}
});

module.exports = mongoose.model('User', UserSchema);