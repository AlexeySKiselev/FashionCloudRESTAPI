/**
 * API Express Route
 * Created by Alexey S. Kiselev on August 2017.
 */

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Cache = require('../models/cache');

router.get('/', function(req, res) {
    res.send('Please, use /api/cache/{key} requests...');
});

// Return all stored keys in the Cache
router.get('/cache',function(req, res) {

});

// Get Data by key
router.get('/cache/:key', function(req, res) {

});

// Create record by key
router.post('/cache/:key', function(req, res) {

});

// Delete given key from cache
router.delete('/cache/:key', function(req, res) {

});

// Delete all keys from the cache
router.delete('/cache', function(req, res) {

});

module.exports = router;
