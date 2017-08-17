/**
 * Mocha Tests
 * Created by Alexey S. Kiselev on August 2017.
 */

var chai = require('chai'),
    chaiHttp = require('chai-http'),
    assert = require('assert'),
    Cache = require('../models/cache'),
    server = require('../server'),
    should = chai.should();

chai.use(chaiHttp);

describe('GET request to /api', function(){
    it('should return status 200', function(done){
        chai.request(server)
            .get('/api')
            .end(function(err,res){
                res.should.have.status(200);
                done();
            });
    });
    it('should return a string "Please, use /api/cache/{key} requests..."', function(done){
        chai.request(server)
            .get('/api')
            .end(function(err,res){
                res.text.should.equal('Please, use /api/cache/{key} requests...');
                done();
            });
    });
});

describe('Generation of random key', function(){
    it('should have 7 chars', function(done){
        Cache.generateKey(function(key){
            assert.equal(7,key.length);
            done();
        });
    });
});
