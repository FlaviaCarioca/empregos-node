var expect = require('chai').expect;
var supertest = require('supertest');
var nock = require('nock');
var app = require('../app');
var faker = require('faker');
var url = "http://localhost:3000";
supertest = supertest.bind(supertest, url);

describe('Candidates Routes', function(){
  before(function(){
    return candidate = {
        'address': faker.address.streetAddress(),
        'city':  faker.address.city(),
        'state': faker.address.stateAbbr(),
        'zip': faker.address.zipCode(),
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

      //return candidate;
  });

  describe('Update', function(){
    it('Updates a candidate profile', function(done){
      var api = nock(url)
                .put('/api/v1/candidate')
                .reply(200);

      supertest(app)
        .put('/api/v1/candidate')
        .send(candidate)
        .expect(200)
        .end(function(error, res){
          if(error){
            console.log(error);
            throw error;
          }
          done();
        });
    });

    it('returns an error if it cannot update the candidate profile', function(done){
      var api = nock(url)
                .put('/api/v1/candidate')
                .reply(422,{ error: 'Something went wrong. Please try again later' });

      supertest(app)
        .put('/api/v1/candidate')
        .send(candidate)
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
