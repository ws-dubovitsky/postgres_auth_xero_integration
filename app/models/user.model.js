(() => {
  "use strict";

  const User = require("../../config/schema/user.schema");

  module.exports = {
    create,
    getAllUsers,
    getById
  };

  function create(data) {
    return new Promise((resolve, reject) => {
      User.sync({ force: true })
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

  //   async function get() {
  //     try {
  //       await User.findAll();
  //     } catch (err) {
  //       console.log("err", err);
  //     }
  //   }

  // req.params.id
  async function getById(user_id) {
    try {
      await findById(user_id);
    } catch (err) {
      console.log("err", err);
    }
  }
})();
