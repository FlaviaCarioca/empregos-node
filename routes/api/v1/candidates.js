var pgp = require('pg-promise')(); // postgres promises integration
var q = require('q');
var moment = require('moment');

exports.update = function(req, res, next){
  var dbClient = pgp(req.app.get('dbConnectionString')); // Create a client

  var candidateQuery = "UPDATE candidates SET address=$1, city=$2, state=$3, zip=$4, title=$5, description=$6, " +
                       "minimum_salary=$7, linkedin=$8, github=$9, is_active=$10, can_relocate=$11, can_remote=$12, " +
                       "is_visa_needed=$13, specialization_id=$14, company_size_id=$15, job_type_id=$16, " +
                       "created_at=$17, updated_at=$18 WHERE id=$19";

  var date = moment().format();

  dbClient.none(candidateQuery, [req.body.address, req.body.city, req.body.state, req.body.zip, req.body.title,
                                req.body.description, req.body.minimum_salary, req.body.linkedin, req.body.github,
                                req.body.is_active, req.body.can_relocate, req.body.can_remote, req.body.is_visa_needed,
                                req.body.specialization_id, req.body.company_size_id, req.body.job_type_id, date, date,
                                req.user.profile_id]
               )
              .then(function(){
                res.status(200).end();
              })
              .catch(function(error){
                console.log(error);
                res.status(422).json({ error: 'Something went wrong. Please try again later' });
              });
}
