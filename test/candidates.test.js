var expect = require('chai').expect;
var supertest = require('supertest');
var app = require('../app');
var faker = require('faker');
var token = '';

describe('Candidates Routes', function(){
  beforeEach(function(done){
    // login and get a token
    var user = { auth: { username: 'f@g.com', password: 'pafuncia' } };

    supertest(app)
      .post('/v1/auth')
      .send(user)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res){
        if(err){
          throw err;
        }

        token = res.body.auth_token;
        done();
    });

    return token;
  });

  before(function(){
    return candidate = {
        'address': faker.address.streetAddress(),
        'city':  faker.address.city(),
        'state': faker.address.stateAbbr(),
        'zip': (faker.address.zipCode()).substring(0,4),
        'title': 'Software Engineer',
        'description': faker.lorem.paragraph(2),
        'minimum_salary': faker.random.number({ min: 200000, max: 999999 }),
        'linkedin': faker.internet.url(),
        'github': faker.internet.url(),
        'is_active': true,
        'can_relocate': false,
        'can_remote': true,
        'is_visa_needed': false
      };
  });

  describe('Update', function(){
    it('Updates a candidate profile', function(done){
      token =  'Bearer ' + token;

      supertest(app)
        .put('/v1/candidate')
        .set('Authorization', token)
        .send({ candidate: candidate })
        .expect(200)
        .end(function(error, res){
          if(error){
            throw error;
          }
          done();
        });
    });

    it('returns an error if it cannot update the candidate profile', function(done){
      candidate.minimum_salary = 30000000
      token =  'Bearer ' + token;

      supertest(app)
        .put('/v1/candidate')
        .set('Authorization', token)
        .send({candidate: candidate})
        .expect(422)
        .end(function(error, res){
          if(error){
            throw error;
          }

          expect(res.body.error).to.equal('Something went wrong. Please try again later');
          done();
        });
    });
  });
});
