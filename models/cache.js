/**
 * MongoDB Model for fc_caches Collection
 * Created by Alexey S. Kiselev on August 2017.
 */

var mongoose = require('mongoose'),
    settings = require('../config/config.json');
mongoose.Promise = global.Promise;
var cacheSchema = new mongoose.Schema({
    key: {
        type: String,
        unique: true,
        required: true
    },
    lastused: {
        type: Date,
        default: Date.now
    },
    ttl: {
        type: Number,
        default: Date.now() + settings.keys[process.env.NODE_ENV].keyTTL
    },
    data: {
        string: String
    }
}, { collection: settings.db.collection });

/**
 * Generate unique Key
 * @returns {string}
 */
cacheSchema.statics.generateString = function(strLength) {
    var chars = 'abcdefghigkmnqrstuvwxyz',
        keyString = '';
    for(var i = 0; i < strLength; i++){
        keyString = keyString.concat(chars[Math.round(Math.random()*(chars.length-1))]);
    }
    return keyString;
};

cacheSchema.statics.checkKey = function(key, callback) {
    var self = this;
    this.findOne({key: key}, function(err, findedKey){
        if(err) callback({status: 'error', consoleMessage: 'An error occured'});
        var currentTime = new Date().getTime();
        if(findedKey){
            if(currentTime < findedKey.ttl){
                callback({status: 'ok', consoleMessage: 'Cache hit', data: findedKey.data});
            } else {
                callback({status: 'exceed', consoleMessage: 'Cache TTL is exceeded', data: {string: self.generateString(20)}});
            }
        } else {
            callback({status: 'miss', consoleMessage: 'Cache miss', data: {string: self.generateString(20)}});
        }
    });
};

cacheSchema.statics.removeExcessedKeys = function(callback) {
    var self = this;
    this.count({},function(err, count){
        if(err) throw err;
        var oldest;
        if(count == settings.keys[process.env.NODE_ENV].allowedKeys){
            oldest = self.find().sort({lastused: 1}).limit(1);
            oldest.exec(function(err, result){
                if(err) throw err;
                self.findOneAndRemove({key : result[0].key}, function(err){
                    if(err) throw err;
                    callback()
                });
            });
        } else {
            callback();
        }
    });
};

cacheSchema.statics.updateTTL = function(key, callback){
    var self = this;
    this.findOne({key: key}, function(err, findedKey){
        if(err) callback({status: 'error', consoleMessage: 'An error occured'});
        self.updateOne({
            key: findedKey.key
        },{
            $set: {
                ttl: (new Date().getTime() + settings.keys[process.env.NODE_ENV].keyTTL),
                lastused: new Date().getTime()
            }
        }, function(err){
            if(err) callback({status: 'error', consoleMessage: 'An error occured'});
            callback({status: 'updated', consoleMessage: 'Info about key ' + key + ' updated'});
        });
    });
};

module.exports = mongoose.model('Cache',cacheSchema);
