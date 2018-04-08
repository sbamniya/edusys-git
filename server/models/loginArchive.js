const config = require('./../config/db');
const db = config.db;

const loginArchiveModel = { 
	userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users'
  },
  loggedInAt: { 
  	type : Date, 
  	default: Date.now 
  },
  loggedInIp: String,
  loggedOutAt: { 
  	type : Date, 
  	default: null 
  },
  loggedOutIp: String
};

const loginArchive = db.model('usersLoginArchive', loginArchiveModel);

module.exports = loginArchive;