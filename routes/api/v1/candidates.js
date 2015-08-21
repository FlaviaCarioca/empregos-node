
exports.update = function(req, res, next){
  var dbClient = pgp(req.app.get('connectionString'));

  var candidateQuery = "INSERT INTO candidates(address, city, state, zip, title, description, minimum_salary," +
                       " linkedin, github, is_active, can_relocate, can_remote, is_visa_needed," +
                       " specialization_id, company_size_id, job_type_id, created_at, updated_at) VALUES ($1, $2, $3," +
                       " $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)";

  var date = moment().format();

  dbClient.none(candidateQuery, [req.body.address, req.body.city, req.body.state, req.body.zip, req.body.title,
                                req.body.description, req.body.minimum_salary, req.body.linkedin, req.body.github,
                                req.body.is_active, req.body.can_relocate, req.body.can_remote, req.body.is_visa_needed,
                                req.body.specialization_id, req.body.company_size_id, req.body.job_type_id, date, date]
               )
              .then(function(){
                res.status(200).end();
              })
              .catch(function(err){
                res.status(422).json({ error: 'Something went wrong. Please try again later' });
              });
}
