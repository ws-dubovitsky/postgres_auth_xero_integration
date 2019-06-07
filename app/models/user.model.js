(() => {
  "use strict";

  const User = require("../../config/schema/index");

  module.exports = {
    create,
    getAllUsers,
    getById
  };

  function create(data) {
    return new Promise((resolve, reject) => {
      User.sync({ alter: true })
        .then(() => {
          const createUser = User.create(data);
          resolve(createUser);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  function getAllUsers() {
    return new Promise((resolve, reject) => {
      User.findAll()
        .then(users => resolve(users))
        .catch(err => reject(err));
    });
  }

  // req.params.id
  async function getById(user_id) {
    try {
      await findById(user_id);
    } catch (err) {
      console.log("err", err);
    }
  }
})();
