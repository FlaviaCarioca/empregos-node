var expect = require('chai').expect;
var supertest = require('supertest');
//var jwt    = require('jsonwebtoken');
var sinon = require('sinon');
var app = require('../app');
var faker = require('faker');
var proxyquire = require('proxyquire').noCallThru();

describe('User Routes', function(){
  describe('authenticate', function(){
    it('should return a token when the user is authenticated', function(done){
      var user = { auth: { username: 'f@g.com', password: 'password' } };
      var expectedProfiletype = 'Candidate';

      supertest(app)
        .post('/v1/auth')
        .send(user)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res){
          if(err){
            console.log(err);
            throw err;
          }

          expect(res.body.auth_token).to.exist;
          expect(res.body.user_type.toUpperCase()).to.equal(expectedProfiletype.toUpperCase());
          done();
        });

    });

    it('should return a 401 if the user cannot be authenticated', function(done){
      var user = { auth: { username: faker.internet.email(), password: faker.internet.password() }};

      supertest(app)
        .post('/v1/auth')
        .send(user)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(401)
        .end(function(error, res){
          if(error){
            console.log(error);
            throw error;
          }

          expect(res.body.error).to.equal('Invalid username or password');
          done();
        });
    });


    xit('should return a 500 if something goes really wrong', function(done){
          var user = { auth: { username: 'f@g.com', password: 'password' } };

          // sinon.stub(jwt, 'sign').returns(null);
          // app = require('../app');
          // var jwtStub = {
          //  sign: function() {
          //      return null;
          //  }
          // };

          const fs = proxyquire('../routes/api/v1/users', { 'jwt': {
            sign: function(payload, secret, exp) {
              cb(null, 'huzzah');
            }}
          });
          //proxyquire('../routes/api/v1/users',  {'jwt': jwtStub});
          // var payload = { user_id: 3 };
          // var secret = app.get('superSecret');
          // var exp = { expiresInMinutes: 1440 };
          // jwtStub.sign = function (payload, secret, exp) { return null; };


          // , function(payload, secret, exp) {
          //     // whatever you would like innerLib.toCrazyCrap to do under test
          //     return null;
          // });

          supertest(app)
            .post('/v1/auth')
            .send(user)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(500)
            .end(function(error, res){
              if(error){
                console.log(error);
                throw error;
              }

              expect(res.body.error).to.equal('Something went wrong. Please try again later');
              done();
            });
        });
  });

  describe('create', function(){
    it('should create a user', function(done){
      var user = { user: { email: 'test@test.com', password: 'testing', profile_id: 3, user_type: 'Candidate',
                  first_name: 'Ana', last_name: 'Banana' }};

      supertest(app)
        .post('/v1/users')
        .send(user)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201)
        .end(function(error, res){
          if(error){
            console.log(error);
            throw error;
          }

          expect(res.body).not.to.be.empty;
          expect(res.body.candidate_id).to.exist;

          done();
        });
    });
  });

});
