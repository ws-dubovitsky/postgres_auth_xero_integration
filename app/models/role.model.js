// (() => {
//   "use strict";
//   const Promise = require("bluebird");
//   const RoleSchema = require("../../config/schema/role.schema");

//   module.exports = {
//     create,
//     update,
//     remove,
//     get
//   };

//   function update(query, data) {
//     return new Promise((resolve, reject) => {
//       RoleSchema.findOneAndUpdate(query, data, {
//         new: true
//       }).exec((err, role) => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve(role);
//         }
//       });
//     });
//   }

//   function get(populate, params) {
//     //populate = { path: "owner" } , params = {} or {_id : req.body._id}
//     return new Promise((resolve, reject) => {
//       RoleSchema.find(params)
//         .populate(populate)
//         .lean()
//         .exec((err, role) => {
//           if (err) {
//             reject(err);
//           } else {
//             resolve(role);
//           }
//         });
//     });
//   }

//   function remove(query) {
//     return new Promise((resolve, reject) => {
//       RoleSchema.findOneAndRemove(query).exec(err => {
//         if (err) {
//           reject(err);
//         } else {
//           resolve();
//         }
//       });
//     });
//   }

//   function create(data) {
//     return new Promise((resolve, reject) => {
//       RoleSchema.create(data, (err, newRole) => {
//         if (err) return reject(err);
//         resolve(newRole);
//       });
//     });
//   }
// })();
