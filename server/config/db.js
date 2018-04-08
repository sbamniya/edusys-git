const config = require('./config');

const mongoose = require('mongoose');
mongoose.connect(config.host);
var db = {
	db: mongoose
}

module.exports = db;