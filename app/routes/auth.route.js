(function() {
  "use strict";

  const auth = require("../authentication/auth.controller");

  module.exports = function(app) {
    app.post("/auth/signup", auth.signup);
    app.post("/auth/activation", auth.activation);
    app.post("/auth/login", auth.login);
    // app.get('/auth', JWTAuthController.auth);
    // app.post('/auth/signup', JWTAuthController.signup);
    // app.post('/auth/login', JWTAuthController.login);
    // app.post('/auth/activation', JWTAuthController.activation);
    // app.post('/auth/password/get-access', JWTAuthController.passwordAccess);
    // app.post('/auth/password/change', JWTAuthController.changePassword);
    // app.post('/auth/:id', JWTAuthController.update);
  };
})();
