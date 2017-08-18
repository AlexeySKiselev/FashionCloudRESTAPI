/**
 * Mocha Tests
 * Created by Alexey S. Kiselev on August 2017.
 */

process.env.NODE_ENV = 'test';

var chai = require('chai'),
    chaiHttp = require('chai-http'),
    assert = require('assert'),
    Cache = require('../models/cache'),
    server = require('../server'),
    should = chai.should(),
    expect = chai.expect,
    settings = require('../config/config.json');

chai.use(chaiHttp);

describe('GET request to /api', function(){
    it('should return status 200', function(done){
        chai.request(server)
            .get('/api')
            .end(function(err, res){
                res.should.have.status(200);
                done();
            });
    });
    it('should return a string "Please, use /api/cache/{key} requests..."', function(done){
        chai.request(server)
            .get('/api')
            .end(function(err, res){
                res.text.should.equal('Please, use /api/cache/{key} requests...');
                done();
            });
    });
});

describe('GET request to /api/cache/123', function(){
    it('should return status 200 and {string: <random string> object}', function(done){
        chai.request(server)
            .get('/api/cache/123')
            .end(function(err, res){
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('string');
                done();
            });
    });
});

describe('Record in CacheBase with key "123"', function(){
    it('should has one record with key "123"', function(done){
        Cache.count({key: '123'}, function(err, count){
            if(err) throw err;
            assert.equal(1,count);
            done();
        });
    });
    it('should contains a record with key "123" and field "string"', function(done){
        Cache.findOne({key: '123'}, function(err, findedKey){
            if(err) throw err;
            assert.equal(true, findedKey.data.hasOwnProperty('string'));
            done();
        });
    });
});

describe('Record in CacheBase with key "123"', function(){
    this.timeout(settings.keys[process.env.NODE_ENV].keyTTL + 2000);
    it('should has updated data.string value with exceeded TTL', function(done){
        Cache.findOne({key: '123'}, function(err, findedKey){
            if(err) throw err;
            setTimeout(function(){
                chai.request(server)
                    .get('/api/cache/123')
                    .end(function(err, res){
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        expect(res.body.string).to.not.equal(findedKey.data.string);
                        done();
                    });
            }, settings.keys[process.env.NODE_ENV].keyTTL + 1000);
        });
    });
    it('should has the same data.string value before TTL exceeded', function(done){
        Cache.findOne({key: '123'}, function(err, findedKey){
            if(err) throw err;
            setTimeout(function(){
                chai.request(server)
                    .get('/api/cache/123')
                    .end(function(err, res){
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        expect(res.body.string).to.equal(findedKey.data.string);
                        done();
                    });
            }, settings.keys[process.env.NODE_ENV].keyTTL - 1000);
        });
    });
    it('should has the same data.string value but with updated TTL', function(done){
        Cache.findOne({key: '123'}, function(err, findedKey){
            if(err) throw err;
            setTimeout(function(){
                chai.request(server)
                    .get('/api/cache/123')
                    .end(function(err, res){
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        Cache.findOne({key: '123'}, function(err, sameKey){
                            expect(sameKey.ttl).to.not.equal(findedKey.ttl);
                            done();
                        });
                    });
            }, settings.keys[process.env.NODE_ENV].keyTTL - 1000);
        });
    });
});

describe('Record in CacheBase with key "456"', function(){
    it('should exists', function(done){
        chai.request(server)
            .get('/api/cache/234')
            .end(function(err, res){
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('string');
                chai.request(server)
                    .get('/api/cache/456')
                    .end(function(err, res){
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('string');
                        Cache.count({key: '456'}, function(err, count){
                            if(err) throw err;
                            assert.equal(1,count);
                            done();
                        });
                    });
            });
    });
    it('should remove record with key "123" from base', function(done){
        Cache.count({key: '123'}, function(err, count){
            if(err) throw err;
            assert.equal(0,count);
            done();
        });
    });
});

describe('GET request to /api/cache', function(){
    it('should return status 200', function(done){
        chai.request(server)
            .get('/api/cache')
            .end(function(err, res){
                res.should.have.status(200);
                done();
            });
    });
    it('should be an array', function(done){
        chai.request(server)
            .get('/api/cache')
            .end(function(err, res){
                res.should.have.status(200);
                res.body.should.be.a('array');
                done();
            });
    });
    it('should has elements with fields "key" and "data"', function(done){
        chai.request(server)
            .get('/api/cache')
            .end(function(err, res){
                res.should.have.status(200);
                if(res.body.length){
                    assert.equal(true, res.body[0].hasOwnProperty('key'));
                    assert.equal(true, res.body[0].hasOwnProperty('data'));
                }
                done();
            });
    });
});
