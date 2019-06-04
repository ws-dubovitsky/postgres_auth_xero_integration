(function () {
	'use strict';

	const Promise						= require('bluebird');
	const AuthService				= require('../../services/auth.service');

	exports.jwtCheck = function (req, res, next) {
		if (req && req.headers && req.headers.authorization) {
			AuthService.jwtVerify(req.headers.authorization)
				.then(decodedToken => {
					if (decodedToken.type === 'authorization') {
						req.userId = decodedToken._id;
					}
					next();
				})
				.catch(error => {
					console.log('error', error);
					next();
				});
		} else {
			req.userId = null;
			next();
		}
	}
})();
