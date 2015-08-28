var pgp = require('pg-promise')(); // postgres promises integration
var q = require('q');
var moment = require('moment');

exports.update = function(req, res, next){
  console.log(req);
  var dbClient = pgp(req.app.get('dbConnectionString')); // Create a client

  var candidateQuery = "UPDATE candidates SET address=$1, city=$2, state=$3, zip=$4, title=$5, description=$6, " +
                       "minimum_salary=$7, linkedin=$8, github=$9, is_active=$10, can_relocate=$11, can_remote=$12, " +
                       "is_visa_needed=$13, specialization_id=$14, company_size_id=$15, job_type_id=$16, " +
                       "created_at=$17, updated_at=$18 WHERE id=$19";

  var date = moment().format();

  dbClient.none(candidateQuery, [req.body.candidate.address, req.body.candidate.city, req.body.candidate.state,
                                 req.body.candidate.zip, req.body.candidate.title,
                                 req.body.candidate.description, req.body.candidate.minimum_salary, req.body.candidate.linkedin, req.body.candidate.github,
                                 req.body.candidate.is_active, req.body.candidate.can_relocate, req.body.candidate.can_remote, req.body.candidate.is_visa_needed,
                                 req.body.candidate.specialization_id, req.body.candidate.company_size_id, req.body.candidate.job_type_id, date, date,
                                 req.user.profile_id])
                .then(function(){
                  res.status(200).end();
                })
                .catch(function(error){
                  console.log(error);
                  res.status(422).json({ error: 'Something went wrong. Please try again later' });
                });
};
