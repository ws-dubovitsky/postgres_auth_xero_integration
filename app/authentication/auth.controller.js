(() => {
  // const Promise = require("bluebird");
  // const jwt = require("jsonwebtoken");
  const AuthService = require("../services/auth.service");
  // const request = require("request-promise");
  const User = require("../../config/schema/user.schema");
  const UserModel = require("../models/user.model");
  // const config = require("../../config/config");
  const Mailer = require("../shared/mailer.service");

  module.exports = {
    auth,
    signup,
    activation
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
        //generate activation token
        const jwtCreate = await AuthService.jwtCreate(user, {
          type: "activation"
        }); // activation

        // find user by ID
        const findUser = await User.findOne({
          where: { id: jwtCreate.user.dataValues.id }
        });

        // update collection User
        // add activation token
        user = await findUser.update({
          activationToken: jwtCreate.token
        });

        console.log("user", user.dataValues);

        console.log("user.dataValues", user.dataValues.email);

        await Mailer.sendActivation({
          // email: 'ws.gorelov@gmail.com',
          email: user.dataValues.email,
          activationToken: user.dataValues.activationToken,
          username: user.dataValues.name
        });

        res.status(200).send({
          status: `Confirm your account please!`,
          user
        });
      }
    } catch (err) {
      console.log("err", err);
    }
  }

  function activation(req, res) {
    let activationToken = req.body.activationToken;
    console.log("activationToken", activationToken);
    return AuthService.jwtVerify(activationToken)
      .then(decodedToken => {
        console.log("decodedToken", decodedToken);
        if (decodedToken.type === "activation") {
          return User.findOne({ id: decodedToken.id });
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
          console.log("user11", user);
          User.findOne({ where: { id: user.dataValues.id } }).then(result => {
            console.log("result", result);
            return result
              .update({ activationToken: null })
              .then(resp => console.log("resp", resp));
          });
          // console.log("findUser", findUser);
        } else {
          throw new Error(
            JSON.stringify({
              status: 400,
              type: `Email is already confirmed`
            })
          );
        }
      })
      .then(resp => {
        res.status(200).send(console.log("resp", resp));
      })
      .catch(err => console.log("err", err));
  }
})();
