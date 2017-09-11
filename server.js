'use strict';
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var MongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');
var routes = require('./app/routes/index.js');
var passport = require('passport');
var multer = require('multer');
var cookieParser = require('cookie-parser');
var cors = require('cors');



require('dotenv').load();
require('./app/config/passport.js')(passport);

var app = express();

app.use(cors({credentials: true, origin: true}));



app.use(cookieParser());
app.use(multer().array());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


app.use(session({
	secret: 'jdfgf56kagjkgr',
	resave: false,
	saveUninitialized: false,
	store: new MongoStore({url:process.env.MONGODB_URI})
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next){
	console.log("IS AUTHENTICATED " + req.isAuthenticated())
	console.log("REQ.USER " + req.user);
	
	// To allow CORS
	//res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
   	//res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    //res.header('Access-Control-Allow-Headers', 'Content-Type');
    //res.header('Access-Control-Allow-Credentials', 'true');


	next();
});


app.use('/public', express.static('public'));
app.use('/build', express.static('./build'));
app.use('/static', express.static('./build/static'));
app.use('/controllers', express.static('./app/controllers'));



mongoose.connect(process.env.MONGODB_URI);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));

db.once('open', function() {
	console.log("Connected to database");
});


routes(app,passport);



var port = process.env.PORT || 3001;


app.listen(port, function() {
	console.log("Node.js is listening on port " + port + "...");
	console.log("NODE_ENV:  ", process.env.NODE_ENV);
});