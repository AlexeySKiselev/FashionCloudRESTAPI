/**
 * App
 * Created by Alexey S. Kiselev on August 2017.
 */

var express = require('express'),
    settings = require('./config/config.json'),
    morgan = require('morgan'),
    bodyParser = require('body-parser')
    mongoose = require('mongoose');

// Connecting to Database
mongoose.connect(settings.db.host+settings.db.name, {
    useMongoClient: true
}, function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log('Successfully connected to', settings.db.host+settings.db.name);
    }
});

// Create Express App
var app = express();

// Logger
app.use(morgan('dev'));

// Routes
var api = require('./routes/api');

// App Settings
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes

// Routes
app.use('/api', api);

// Error and 404
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

module.exports = app;
