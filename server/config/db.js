const config = require('./config');

const mongoose = require('mongoose');
mongoose.connect(config.db.host);
var db = {
	db: mongoose
}

module.exports = db;