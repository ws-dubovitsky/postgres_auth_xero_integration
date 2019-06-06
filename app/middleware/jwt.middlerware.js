(function() {
  "use strict";

  //   const Promise = require("bluebird");
  const AuthService = require("../services/auth.service");

  exports.jwtCheck = function(req, res) {
    console.log("req", req);
    // console.log("req.body", req.body);

    // console.log("req.headers.authorization", req.headers.authorization);

    if (req && req.headers && req.headers.authorization) {
      AuthService.jwtVerify(req.headers.authorization)
        .then(decodedToken => {
          console.log("decodedToken", decodedToken);
          if (decodedToken.type === "authorization") {
            req.userId = decodedToken._id;
          }
        })
        .catch(error => {
          console.log("error", error);
        });
    } else {
      req.userId = null;
    }
  };
})();
