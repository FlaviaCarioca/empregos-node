var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var pgp = require('pg-promise')(); // postgres promises integration

module.exports = {
	authVerification: function(req, res, next) {
		// TODO: Refreshing the token when close to expiration

		// Check the authorization header for the token
		var token = req.headers['authorization'] || req.headers['Authorization'];
		// Decode the token
		if (token) {
			// Verifies secret and checks expiration
			jwt.verify(token.split(' ').pop(), req.app.get('superSecret'), function(error, decoded) {
				if (error) {
					return res.status(401).json({
						error: 'Failed to authenticate the token.'
					});
				} else {
					if (req.user != decoded['user_id']) {
						// Check if the user is authorized to access the route
						var dbClient = pgp(req.app.get('dbConnectionString'));

						var selectQuery = 'SELECT u.id, u.profile_id FROM users u WHERE u.id = $1';

						dbClient.one(selectQuery, [decoded['user_id']])
							.then(function(data) {
								console.log(data);
								req.user = data; // Save the user
							})
							.catch(function(error) {
								res.status(401).json({
									error: 'Failed to authenticate the token.'
								});
							});
					}

					// If everything is good, save to request for use in other routes
					//req.decoded = decoded;
					next();
				}
			});
		} else {
			// If there is no token return an error
			return res.status(403).json({ error: 'No token provided.' });
		}
	}
};
