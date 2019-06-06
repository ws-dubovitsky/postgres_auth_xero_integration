const Sequelize = require("sequelize");
const db = require("../database");

const User = db.define("test", {
  name: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING
  },
  role: {
    type: Sequelize.STRING,
    defaultValue: "user"
  },
  password: {
    type: Sequelize.STRING
  },
  activationToken: {
    type: Sequelize.STRING,
    defaultValue: "undefined"
  }
});

module.exports = User;
