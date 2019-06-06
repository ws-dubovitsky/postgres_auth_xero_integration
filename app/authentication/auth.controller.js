(() => {
  const Promise = require("bluebird");
  const jwt = require("jsonwebtoken");
  const AuthService = require("../services/auth.service");
  const request = require("request-promise");
  const User = require("../../config/schema/user.schema");
  const UserModel = require("../models/user.model");
  const config = require("../../config/config");

  module.exports = {
    auth,
    signup
  };

  // authorization by ID
  async function auth(req, res) {
    try {
      const user = await User.getById(req.user_id);
      res.status(200).send(user);
    } catch (err) {
      res.status(400).send(err);
    }
  }

  // register new user
  async function signup(req, res) {
    try {
      let { name, email, role, password } = req.body;
      console.log("req.body", req.body);
      let user = await User.findOne({ where: { email } });
      if (user) {
        res.status(400).send("That user is already exists");
        throw new Error(
          JSON.stringify({
            status: 400,
            type: `That user is already exists`
          })
        );
      } else {
        const hash = await AuthService.generateHash(password);
        let userToCreate = {
          email,
          name,
          role,
          password: hash
        };
        user = await UserModel.create(userToCreate);
        res.status(200).send(user);
      }
    } catch (err) {
      console.log("err", err);
      // res.status(400).send(err);
    }
  }
})();
