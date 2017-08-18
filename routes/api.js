/**
 * API Express Route
 * Created by Alexey S. Kiselev on August 2017.
 */

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Cache = require('../models/cache');
var settings = require('../config/config.json');

router.get('/', function(req, res) {
    res.send('Please, use /api/cache/{key} requests...');
});

// Return all stored keys in the Cache
router.get('/cache',function(req, res) {
    var findCursor = Cache.find({},{_id: 0, __v: 0});
    findCursor.exec(function(err, caches){
        if(err) throw err;
        res.json(caches);
    });
});

// Get Data by key
router.get('/cache/:key', function(req, res) {
    Cache.checkKey(req.params.key, function(response){
        console.log(response.consoleMessage);
        switch(response.status){
            case 'error':
                res.json({error: true});
                break;
            case 'ok':
                Cache.updateTTL(req.params.key, function(updRes){
                    if(updRes.status == 'updated'){
                        console.log(updRes.consoleMessage);
                        res.json(response.data);
                    } else {
                        res.json({error: true});
                    }
                });
                break;
            case 'miss':
                Cache.removeExcessedKeys(function(){
                    var newCache = new Cache({
                        key: req.params.key,
                        data: response.data
                    });
                    newCache.save(function(err){
                        if(err) throw err;
                        res.json(response.data);
                    });
                });
                break;
            case 'exceed':
                Cache.updateOne({
                    key: req.params.key
                },{$set: {
                    ttl: (new Date().getTime() + settings.keys[process.env.NODE_ENV].keyTTL),
                    lastused: new Date().getTime(),
                    data: response.data
                }}, function(err) {
                    if(err) throw err;
                    res.json(response.data);
                });
                break;
            default:
                res.json({error: true});
                break;
        }
    });
});

// Create or Update record by key
router.post('/cache/:key', function(req, res) {

});

// Delete given key from cache
router.delete('/cache/:key', function(req, res) {

});

// Delete all keys from the cache
router.delete('/cache', function(req, res) {

});

module.exports = router;
