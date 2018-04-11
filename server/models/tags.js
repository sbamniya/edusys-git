const config = require('./../config/db');
const db = config.db;

const tagModel = { 
	tagName: String,
	tagDescription: String,
	location: String,
	videoType: Number,
	videUrl: String,
	country: String,
	geoLocation: {
		type: [Number],
    index: '2d'
	},
	isActive: Boolean,
	createdBy: {
      type: db.Schema.Types.ObjectId,
      ref: 'users'
  },
  createdAt: { 
  	type : Date, 
  	default: Date.now 
  },
	createdIp: String,
	updatedBy: {
      type: db.Schema.Types.ObjectId,
      ref: 'users'
  },
	updatedAt: { 
  	type : Date, 
  	default: Date.now 
  },
	updatedIp: String
};

const tags = db.model('tags', tagModel);

module.exports = tags;