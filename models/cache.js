/**
 * MongoDB Model for fc_caches Collection
 * Created by Alexey S. Kiselev on August 2017.
 */

var mongoose = require('mongoose');
var cacheSchema = new mongoose.Schema({
    key: {
        type: String,
        unique: true,
        required: true
    },
    used: {
        type: Date,
        default: Date.now
    },
    ttl: {
        type: Number
    },
    data: {
        string: String
    }
}, { collection: 'fc_caches' });

/**
 * Generate unique Key
 * @returns {string}
 */
cacheSchema.statics.generateKey = function(callback) {
    var chars = 'abcdefghigkmnqrstuvwxyz',
        strLength = 7,
        keyString = '';
    for(var i = 0; i < strLength; i++){
        keyString = keyString.concat(chars[Math.round(Math.random()*(chars.length-1))]);
    }
    this.findOne({key: keyString},function(err, findedKey){
        if(err) throw err;
        if(!findedKey) {
            callback(keyString);
        } else cacheSchema.generateKey(callback);
    });
};

module.exports = mongoose.model('Cache',cacheSchema);
