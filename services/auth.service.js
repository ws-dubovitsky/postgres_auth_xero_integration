// (function() {
//   "use strict";

//   const jwt = require("jsonwebtoken");
//   const bcrypt = require("bcrypt-nodejs");
//   const config = require("../config/config.js");
//   const JWT_KEY = config.JWT_KEY;

//   module.exports = {
//     jwtCreate,
//     jwtVerify,
//     comparePassword,
//     generateHash
//   };

//   function jwtCreate(user, params = {}, expiresIn = "1d") {
//     let payload = {
//       _id: user._id,
//       super: user.super,
//       ...params,
//       type: params.type || "authorization"
//     };

//     return new Promise(function(resolve, reject) {
//       jwt.sign(payload, JWT_KEY, { expiresIn }, function(err, token) {
//         // in seconds equals 15 min
//         if (err) {
//           reject(
//             new Error(
//               JSON.stringify({
//                 status: 400,
//                 type: "JWT Generate Server Error"
//               })
//             )
//           );
//         } else {
//           resolve({ token: token, user: user });
//         }
//       });
//     });
//   }

//   function jwtVerify(token, key) {
//     return new Promise(function(resolve, reject) {
//       jwt.verify(token, key || JWT_KEY, function(err, decoded) {
//         if (err) {
//           reject(
//             new Error(
//               JSON.stringify({
//                 status: 400,
//                 type: "JWT Verify Server Error"
//               })
//             )
//           );
//         } else {
//           resolve(decoded); // jwt payload
//         }
//       });
//     });
//   }

//   function comparePassword(password, currentUser) {
//     return new Promise(function(resolve, reject) {
//       bcrypt.compare(password, currentUser.password, function(err, same) {
//         if (err) {
//           // bcrypt internal error or smth.
//           reject(
//             new Error(
//               JSON.stringify({
//                 status: 400,
//                 type: "Login failed"
//               })
//             )
//           );
//         } else if (!err && !same) {
//           // wrong password
//           reject(
//             new Error(
//               JSON.stringify({
//                 status: 400,
//                 type: `Passwords don't match`
//               })
//             )
//           );
//         } else {
//           // user exists and credentials is correct
//           return resolve(currentUser);
//         }
//       });
//     });
//   }

//   function generateHash(password) {
//     return new Promise(function(resolve) {
//       let salt = bcrypt.genSaltSync(10);
//       let hash = bcrypt.hashSync(password, salt);
//       resolve(hash);
//     });
//   }
// })();
