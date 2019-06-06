(function() {
  "use strict";

  // const JWTAuthController = require('../authentication/auth.controller');

  const auth = require("../authentication/auth.controller");

  module.exports = function(app) {
    app.post("/signup", auth.signup);
    app.post("/auth/activation", auth.activation);
    // app.get('/auth', JWTAuthController.auth);
    // app.post('/auth/login/instagram', JWTAuthController.instaLogin);
    // app.post('/auth/login/facebook', JWTAuthController.facebookLogin);
    // app.post('/auth/login/linkedin', JWTAuthController.linkedinLogin);
    // app.post('/auth/login/google', JWTAuthController.googleLogin);
    // app.post('/auth/signup', JWTAuthController.signup);
    // app.post('/auth/login', JWTAuthController.login);
    // app.post('/auth/activation', JWTAuthController.activation);
    // app.post('/auth/password/get-access', JWTAuthController.passwordAccess);
    // app.post('/auth/password/change', JWTAuthController.changePassword);
    // app.post('/auth/:id', JWTAuthController.update);
  };
})();
