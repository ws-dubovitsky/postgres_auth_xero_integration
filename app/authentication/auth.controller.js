(function() {
  "use strict";

  const Promise = require("bluebird");
  const server = require("../../server");
  //   const request = require("request-promise");
  const AuthService = require("../../services/auth.service");
  const Mailer = require("../shared/mailer.service");
  //   const jwt = require("jsonwebtoken");
  const config = require("../../config/config");

  const RoleModel = require("../models/role.model");

  const User = server.main.model("User");

  const Xero = require("../../services/xero.service");

  addSuperUser();

  module.exports = {
    auth,
    update,
    signup,
    login,
    activation,
    passwordAccess,
    changePassword
  };

  async function auth(req, res, next) {
    try {
      const user = await User.findById(req.userId);
      res.status(200).send(user);
    } catch (error) {
      next(error);
    }
  }

  async function update(req, res, next) {
    try {
      const user = await User.findById(req.userId);
      if (user) {
        let owner = await User.findById(req.params.id).populate({
          path: "deals",
          populate: { path: "buildings" }
        });
        if (owner) {
          const newParams = {
            firstname: req.body.user.firstname,
            lastname: req.body.user.lastname,
            avatar: req.body.user.avatar,
            role: req.body.user.role
          };

          if (user.super || user._id.equals(owner._id)) {
            Object.assign(owner, newParams);
            owner = await owner.save();

            res.status(200).send(owner);
          } else {
            throw new Error("you have not access for this");
          }
        } else {
          throw new Error("user not found");
        }
      } else {
        throw new Error("you not loged in");
      }
    } catch (error) {
      next(error);
    }
  }

  function deleteUser(username) {
    return User.findOneAndRemove({ username: username });
  }

  function passwordAccess(req, res, next) {
    const email = req.body.email;

    return User.findOne({ email: email })
      .then(user => {
        if (user === undefined) {
          throw new Error(
            JSON.stringify({
              status: 400,
              type: `User doesn't exists`
            })
          );
        } else {
          return AuthService.jwtCreate(user, { type: "password-reset" });
        }
      })
      .then(result => {
        return User.findOneAndUpdate(
          { _id: result.user._id },
          { resetToken: result.token },
          { fields: "+resetToken", new: true }
        );
      })
      .then(result => {
        return Mailer.sendResetToken({
          // email: 'ws.gorelov@gmail.com',
          email: result.email,
          resetToken: result.resetToken,
          username: result.username
        });
      })
      .then(() => {
        res.status(200).send();
      })
      .catch(err => next(err));
  }

  function changePassword(req, res, next) {
    const resetToken = req.body.token;
    const password = req.body.password;
    let userId = null;

    return AuthService.jwtVerify(resetToken)
      .then(decodedToken => {
        if (decodedToken.type === "password-reset") {
          return User.findOne({ _id: decodedToken._id }).select("+resetToken");
        } else {
          throw new Error("token type verify error!");
        }
      })
      .then(user => {
        if (!user) {
          throw new Error(
            JSON.stringify({
              status: 400,
              type: `User doesn't exists`
            })
          );
        } else if (user.resetToken === resetToken) {
          userId = user._id;
          return User.findOneAndUpdate(
            { _id: userId },
            { resetToken: null },
            { new: true }
          );
        } else {
          throw new Error(
            JSON.stringify({
              status: 400,
              type: `Email is already confirmed`
            })
          );
        }
      })
      .then(() => {
        return AuthService.generateHash(password);
      })
      .then(hash => {
        return User.findOneAndUpdate(
          { _id: userId },
          { password: hash },
          { new: true }
        );
      })
      .then(result => {
        res.status(200).send();
      })
      .catch(err => next(err));
  }

  // send token to email
  // after actiovation user will register
  function activation(req, res, next) {
    let activationToken = req.body.activationToken;

    return AuthService.jwtVerify(activationToken)
      .then(decodedToken => {
        if (decodedToken.type === "activation") {
          return User.findOne({ _id: decodedToken._id }).select(
            "+activationToken"
          );
        } else {
          throw new Error("token type verify error!");
        }
      })
      .then(user => {
        if (user === undefined) {
          throw new Error(
            JSON.stringify({
              status: 400,
              type: `User doesn't exists`
            })
          );
        } else if (user.activationToken === activationToken) {
          return User.findOneAndUpdate(
            { _id: user._id },
            { activationToken: null },
            { new: true }
          );
        } else {
          throw new Error(
            JSON.stringify({
              status: 400,
              type: `Email is already confirmed`
            })
          );
        }
      })
      .then(() => {
        res.status(200).send();
      })
      .catch(err => next(err));
  }

  //register user
  async function signup(req, res) {
    try {
      let {
        username,
        firstname,
        lastname,
        age,
        nationality,
        phone,
        country,
        email,
        password,
        checked
      } = req.body;

      let user = await User.findOne({ username });
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
          username,
          firstname,
          lastname,
          password: hash,
          avatar: `${config.API_URL}/assets/user.png`,
          age,
          nationality,
          phone,
          country,
          visa: checked
          // name: company
        };
        user = await User.create(userToCreate);
        // const existsUser = user;
        const query = { name: req.body.company };
        const getCompany = await CompanyModel.get(query);
        if (getCompany && !getCompany[0]) {
          // no organization and no user
          const createCompany = await CompanyModel.create({
            owner_id: user._id,
            name: req.body.company
          });

          await User.update({ _id: user._id }, { company: createCompany._id });
        }

        const jwtCreate = await AuthService.jwtCreate(user, {
          type: "activation"
        }); // activation

        const result = await User.findOneAndUpdate(
          { _id: jwtCreate.user._id },
          { activationToken: jwtCreate.token },
          { fields: "+activationToken", new: true }
        );

        await Mailer.sendActivation({
          // email: 'ws.gorelov@gmail.com',
          email: result.email,
          activationToken: result.activationToken,
          username: result.username
        });
        res.status(200).send(user);
      }
    } catch (err) {
      console.log("err", err);
      res.status(400).send(err);
    }
  }

  //login user

  async function login(req, res) {
    let { username, password } = req.body;
    let user = await User.findOne({ username }).select(
      "+password +activationToken"
    );
    if (!user) {
      throw new Error(
        JSON.stringify({
          status: 400,
          type: `User doesn't exists`
        })
      );
    }
    user = await AuthService.comparePassword(password, user);
    if (!user.activationToken) {
      const result = await AuthService.jwtCreate(user);
      res.status(200).send(result);
    } else {
      throw new Error(
        JSON.stringify({
          status: 403,
          type: `Not confirmed email`
        })
      );
    }
  }

  //default admin
  async function addSuperUser() {
    try {
      let user = await User.findOne({ username: "superuser" });

      if (!user) {
        const pass = await AuthService.generateHash("superuser123");

        user = await User.create({
          username: "superuser",
          avatar: `${config.API_URL}/assets/superuser.jpg`,
          email: config.EMAIL_SERVICE_LOGIN,
          firstname: "Super",
          lastname: "User",
          password: pass,
          super: true
        });
        console.log("ok");
        
        Xero.App();
      }
    } catch (error) {
      console.log("error", error);
    }
  }
})();
