(function() {
  "use strict";

  const RoleController = require("../models/role.model");
  //   const UserModel = require("../authentication/auth.controller");

  async function createRole(req, res) {
    try {
      const roleUser = await RoleController.create(req.body.type); // type is role
      console.log("userRole", userRole);
      res.status(200).send(roleUser);
    } catch (err) {
      res.status(400).send(err);
    }
  }

  async function getRole(req, res) {
    try {
      const role = await RoleController.get({ _id: req.params.id });
      res.status(200).send(role);
    } catch (err) {
      res.status(400).send(err);
    }
  }

  module.exports = {
    createRole,
    getRole
  };
})();
