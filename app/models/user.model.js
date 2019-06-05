let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let User = new Schema({
	username : {
		type     : String,
		unique   : true,
		required : true
	},
	avatar        : String,
	email					: String,
	firstname     : String,
	lastname      : String,
	password      : { type: String, select: false },
	token      		: { type: String, select: false },
	activationToken : { type: String, select: false },
	resetToken    : { type: String, select: false },
	super         : {
		type    : Boolean,
		default : false,
	},
	role       	 : {
		type    : String,
		default : 'admin', // user, buyer, seller, broker, landlord, lender, tenant
	},

	searchField: { type: String, index: true, select: false },
});

User.pre('save', function(next) {
	let str = '';
  const fields = ['username', 'firstname', 'lastname', 'role'];
  fields.forEach(field => {
    if (this[field]) {
      str += this[field];
    }
  });
  this.searchField = str.replace(/\s+/g, ' ').trim();
  next();
});


User.set('toJSON', {
	transform: function (doc, ret, opt) {
			delete ret['password'];
			delete ret['token'];
			delete ret['resetToken'];
			delete ret['activationToken'];
			delete ret['searchField'];

			return ret;
	}
})

module.exports = mongoose.model('User', User);