const crypto = require('crypto');

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

module.exports = {
	generateSalt,
	hashPassword,
	verifyPassword,
	getIpAddress
}