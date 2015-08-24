var expect = require('chai').expect;
var supertest = require('supertest');
var app = require('../app');

describe('User Routes', function(){
  describe('authenticate', function(){
    it('should return a token when the user is authenticated', function(done){
      var user = { email: 'f@g.com', password: 'pafuncia'};
      var expectedProfiletype = 'Candidate';

      supertest(app)
        .post('/api/v1/auth')
        .send(user)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res){
          if(err){
            console.log(error);
            throw err;
          }

          expect(res.body['auth_token']).to.exist;
          expect(res.body['user_type']).to.equal(expectedProfiletype);
          done();
        });

    });

    it('should return an error if the user cannot be authenticated', function(done){
      var user = { email: 'bah@b.com', password: 'none' };

      supertest(app)
        .post('/api/v1/auth')
        .send(user)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(401)
        .end(function(error, res){
          if(error){
            console.log(error);
            throw error;
          }

          expect(res.body["error"]).to.equal('Invalid username or password');
          done();
        })
    });
  });

  describe('create', function(){
    it('should create a user')
  });

});
