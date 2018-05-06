const config = require('./../config/db');
const db = config.db;

const userModel = { 
	firstName: String,
	lastName: String,
	email: String,
	mobile: String,
	password: String,
	salt: String,
	isActive: Boolean,
	userRole: String,
	createdAt: { 
  	type : Date, 
  	default: Date.now 
  },
	createdIp: String,
	updatedAt: { 
  	type : Date, 
  	default: Date.now 
  },
	updatedIp: String
};

const users = db.model('users', userModel);

module.exports = users;