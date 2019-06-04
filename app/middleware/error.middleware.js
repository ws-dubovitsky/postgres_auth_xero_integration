(function () {
	'use strict';
	
	exports.handleError = function (err, req, res, next) {
		var error = {};
		if (err && err.message) {
			try {
				error = JSON.parse(err.message);
			} catch (_error) {
				error.type = err.message;
				error.status = 400;
			}
		}
		res.status(error.status || 400).send(error || 'Bad Request');
	};
})();
