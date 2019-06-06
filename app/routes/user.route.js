(function() {
  "use strict";

  const db = require("../../config/database");
  const User = require("../controllers/user.controller");

  module.exports = async function(app) {
    app.get("/users", User.getUser);
    app.post("/create_user", User.createUser);
    // app.get("/user", RoleController.createRole);
    // app.get("/api/get_role", RoleController.getRole);
  };
})();
