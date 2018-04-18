const crypto = require('crypto');
const multer = require('multer');
const config = require('./../config/config');

const generateSalt = (length = 10)=>{
	var text = '';
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

const hashPassword = (password, salt = '123456') => {
	const hash = crypto.createHash('sha256');
	return hash.update(password+'-'+salt).digest("hex");
}

const verifyPassword = (hashedPassword, password, salt = '123456')=>{
	const hash = crypto.createHash('sha256');
	var pwd = hash.update(password+'-'+salt).digest("hex");
	return pwd == hashedPassword;
}

const getIpAddress = (req)=>{
	var ip = null;
	try{
		ip = req.headers['x-forwarded-for'].split(',').pop() || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
	}catch(ex){
		ip = null;
	}

	return ip;
}

const formatValidationErr = (err, isString = false, delimeter = '<br>') =>{
	if (typeof err !== 'object') {
		return err;
	}
	var e = [];
	for(let i in err){
		e.push(err[i].msg)
	}
	if (isString===false) {
		return e;
	}
	return e.join(delimeter);
}

const sendMail = (to, subject, html, callback)=>{
	const transporter = config.mail;
	var mailOptions = {
		from: config.mailConfig.name+' <'+config.mailConfig.user+'>',
	  to: to,
	  subject: subject,
	  html: html
	}

	transporter.sendMail(mailOptions, function(error, info){
	  if (error) {
	    callback(error);
	  } else {
	    callback(null, info.response);
	  }
	});
}

const isValidObjectId = function(id) {
	return id.match(/^[0-9a-fA-F]{24}$/);
}

const storage = multer.diskStorage({
  // destination
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
  	var filenameArr = file.originalname.split('.');
    cb(null, filenameArr[0] + '-' + Date.now()+'.'+filenameArr[filenameArr.length - 1]);
  }
});
const upload = multer({ storage: storage });

module.exports = {
	generateSalt,
	hashPassword,
	verifyPassword,
	getIpAddress,
	formatValidationErr,
	sendMail,
	isValidObjectId,
	upload
}