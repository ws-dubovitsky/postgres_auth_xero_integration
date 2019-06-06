// (() => {
//   const Promise = require("bluebird");

//   module.exports = {
//     signup
//   };

//   async function signup(req, res) {
//     let newUser;
//     const hash = bsrypt.hashSync(req.params.password, 8);
//     console.log("hash", hash);
//     newUser = await Users().insert({
//       email: req.params.email,
//       password: hash
//     });
//     console.log("newUser", newUser);
//     res.status(200).send(newuser);
//     // res.redirectr("/signin");
//   }
// })();
