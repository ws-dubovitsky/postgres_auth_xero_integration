(function() {
  "use strict";

  const User = require("../models/user.model");

  module.exports = {
    createUser,
    getUser
  };

  async function createUser(req, res) {
    try {
      await User.create(req.body);
    } catch (err) {
      res.status(400).send(err);
    }
  }

  async function getUser(req, res) {
    try {
      const findUsers = await User.getAllUsers();
      res.status(200).send(findUsers);
    } catch (err) {
      res.status(400).send(err);
    }
  }
})();
