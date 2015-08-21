var pgp = require('pg-promise')(); // postgres promises integration
var q = require('q');
var moment = require('moment');
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens

exports.create = function(req, res, next){
  var dbClient = pgp(req.app.get('dbConnectionString')); // Create a client

  if(req.body.profile_type.toUpperCase() == req.app.get('Candidate').toUpperCase()){
    // Create a candidate profile
    var candidateQueryString = "INSERT INTO candidates(first_name, last_name, created_at, updated_at) values ($1, $2, $3, $4) returning id";

    // Create a user
    var userQueryString = "INSERT INTO users (email, password, profile_id, profile_type, created_at, updated_at) values ($1, $2, $3, $4, $5, $6) returning id";

    dbClient.tx(function (t) {
      date = moment().format();
      return t.one(candidateQueryString, [req.body.first_name, req.body.last_name, date, date])
              .then(function(data) {
                t.one(userQueryString, [req.body.email, req.body.password, data.id, req.body.profile_type, date, date])
                 .then(function(data){
                   res.status(201).json({ candidate_id: data.id });
                })
              })
              .catch(function(error){
                 console.log('Error running candidate-user transaction', error);
                 res.status(422).json({ 'error': 'Something went wrong. Please try again later' });
              });
    });
  }
}

// Authenticates the user and returns a token
exports.authenticate = function(req, res, next){
  var dbClient = pgp(req.app.get('dbConnectionString')); // Create a client

  var authQuery = "SELECT u.id, u.profile_type FROM users u " +
                  "WHERE email = $1 and password = $2";

  dbClient.query(authQuery, [req.body.email, req.body.password])
    .then(function(data){
      payload = { user_id: data[0].id };

      // Creates the token
      var token = jwt.sign(payload, req.app.get('superSecret'), { expiresInMinutes: 1440 }); // expires in 24 hours

      // return the information including token as JSON
      res.status(200).json({ auth_token: token, user_type: data[0].profile_type });
    })
    .catch(function(error){
      res.status(401).json({ error: 'Invalid username or password' });
    });
}
