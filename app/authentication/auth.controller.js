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
    activation,
    login
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
        // console.log("user", user);
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
    return AuthService.jwtVerify(activationToken)
      .then(decodedToken => {
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
          User.findOne({ where: { id: user.dataValues.id } }).then(result => {
            return result.update({ activationToken: null }).then(newUser =>
              res.status(200).send({
                status: `User activated`,
                user: newUser.dataValues
              })
            );
          });
        } else {
          throw new Error(
            JSON.stringify({
              status: 400,
              type: `Email is already confirmed`
            })
          );
        }
      });
  }

  async function login(req, res) {
    let { email, password } = req.body;
    console.log("req.body", req.body);
    let user = await User.findOne({ where: { email } });
    console.log("user", user);
    if (!user) {
      res.status(400).send({
        type: `User doesn't exists`
      });
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
      res.status(200).send({
        status: "User logs",
        user: result
      });
    } else {
      res.status(400).send({
        type: `Not confirmed email`
      });
      throw new Error(
        JSON.stringify({
          status: 403,
          type: `Not confirmed email`
        })
      );
    }
  }
})();
