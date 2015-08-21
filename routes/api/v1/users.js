var pgp = require('pg-promise')(); // postgres promises integration
var q = require('q');
var moment = require('moment');

exports.create = function(req, res, next){
  // Get the connection string
  var connectionString = req.app.get('dbConnectionString');

  // Create a client
  var dbClient = pgp(connectionString);

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
                .catch(function(error) {
                  console.log('Error running candidate-user transaction', error);
                  res.status(422).json({ 'error': 'Something went wrong. Please try again later' });
                });
              })
              .catch(function(error){
                 console.log('Error running candidate-user transaction', error);
                 res.status(422).json({ 'error': 'Something went wrong. Please try again later' });
              });
    });
  }
}
