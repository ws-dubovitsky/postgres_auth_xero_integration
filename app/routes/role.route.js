(function() {
  "use strict";

  let RoleController = require("../controllers/role.controller");

  module.exports = function(app) {
    app.post("/api/create_role", RoleController.createRole);
    app.get("/api/get_role", RoleController.getRole);
  };
})();
