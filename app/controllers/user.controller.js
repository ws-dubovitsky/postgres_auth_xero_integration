(function() {
  "use strict";

  const User = require("../models/user.model");
//   const Promise = require("bluebird");

  module.exports = {
    createUser,
    getUser
  };
  //   const UserModel = require("../authentication/auth.controller");

  async function createUser(req, res) {
    // const { name, description, email } = req.body;

    console.log("req.body", req.body);
    try {
      const createdUser = await User.create(req.body);
      //   const createdUser = await User.create({

      //   });

      console.log("createdUser", createdUser);

      //   await User.sync({ force: true }).success(async function() {
      //     await User.create({
      //       name,
      //       description,
      //       email
      //     }).success(async function(sdepold) {
      //       console.log(sdepold.values);
      //     });
      //   });
      //   res.status(200).send(roleUser);
    } catch (err) {
      res.status(400).send(err);
    }
  }

  async function getUser(req, res) {
    try {
      const findUsers = await User.getAllUsers();
      console.log("findUsers", findUsers);
      res.status(200).send("Ok");
      //   const role = await RoleController.get({ _id: req.params.id });
      //   res.status(200).send(role);
    } catch (err) {
      console.log("err", err);
      res.status(400).send(err);
    }
  }
})();
