var expect = require('chai').expect;
var supertest = require('supertest');
var app = require('../app');
var nock = require('nock');
var faker = require('faker');
var url = 'http://localhost:3000';
supertest = supertest.bind(supertest, url);

describe('User Routes', function(){
  beforeEach(function(){
    nock.cleanAll();
  });

  describe('authenticate', function(){
    it('should return a token when the user is authenticated', function(done){
      var user = { email: faker.internet.email(), password: faker.internet.password() };
      var expectedProfiletype = 'Candidate';
      var response = { 'auth_token': 'sdfasdfadsg.tywrywrywreywery.hjkghjkghjkghjk', user_type: 'Candidate' }

      var api = nock(url)
                .post('/api/v1/auth', user)
                .reply(200, response);

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
      var user = { email: faker.internet.email(), password: faker.internet.password() };

      var api = nock(url)
                .post('/api/v1/auth')
                .reply(401, { error: 'Invalid username or password' })

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
    it('should create a user', function(done){
      var user = { email: 'test@test.com', password: 'testing', profile_id: 1, profile_type: 'Candidate',
                  first_name: 'Ana', last_name: 'Banana' };
     var response = { candidate_id: 50, user_type: 'Candidate' };

      var api = nock(url)
                .post('/api/v1/users')
                .reply(201, response)

      supertest(app)
        .post('/api/v1/users')
        .send(user)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201)
        .end(function(error, res){
          if(error){
            console.log(error);
            throw error;
          }

          expect(res.body).to.eql(response);

          done();
        });
    });
  });

});
