/**
 * Simple HTTP Server
 * Created by Alexey S. Kiselev on August 2017.
 */

// Modules
var http = require('http');
var app = require('./app');
var settings = require('./config/config.json');

// Create Server
var server = http.createServer();
server.on('request',app);
server.listen(settings.server.port,function(){
    console.log('Server is running on port', settings.server.port);
});

module.exports = server;
