const user = require('./../models/users');
const loginArchive = require('./../models/loginArchive');

const common = require('./../common');
const { validationResult } = require('express-validator/check');

const authenticate = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({message: common.formatValidationErr(errors.mapped(), true)});
	}
	var email = req.body.email;
	var password = req.body.password;

	user.findOne({email: email}).then(data=>{
		var response = {};
		var status = 404;
		var isSuccess = false;
		var message = 'User details not found!';
		if (data && data._id) {
			status = 401;
			message = 'Incorrect password!';
			if (common.verifyPassword(data.password, password, data.salt)) {
				status = 200;
				message = 'User authenticated!';
				isSuccess = true;
				response = {
					id: data._id,
					firstName: data.firstName,
					lastName: data.lastName,
					email: data.email,
					mobile: data.mobile,
					userRole: data.userRole
				}
				req.session.userData = response;
				var $data = {
					userId: data._id,
					loggedInIp: common.getIpAddress(req),
				}
				var newLogin = new loginArchive($data);
				newLogin.save();
			}
		}
		res.status(status).json({success: isSuccess, data: response, message: message});
	}, err=>{
		console.log(err)
		res.status(500).json({success: false, data: []});
	})
}

const getUserSessionData = (req, res, next) => {
	var response = req.session.userData ? req.session.userData : {};
	res.status(200).json({success: true, data: response});
}

const sendAndUpdatePassword = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({message: common.formatValidationErr(errors.mapped(), true)});
	}
	var email = req.body.email;

	user.findOne({email: email}).then(data=>{
		var response = {};
		var status = 404;
		var isSuccess = false;
		var message = 'User details not found!';
		if (data && data._id) {
			status = 200;
			isSuccess = true;
			message = 'New password has been sent to your email!';
			var newPass = common.generateSalt(10);
			var hash = common.hashPassword(newPass, data.salt);
			data.set({password: hash, updatedAt: new Date(), updatedIp: common.getIpAddress(req)});
			data.save().then(data=>{
				response = data;
				common.sendMail(data.email, 'New password', 'Your new password is :: <b>'+ newPass +'</b>', (err, d)=>{
					console.log(err, d);
				});
				res.status(status).json({success: isSuccess, data: response, message: message});
			}, err => {
				console.log(err)
				res.status(500).json({success: false, data: []});			
			})
		}else{
			res.status(status).json({success: isSuccess, data: response, message: message});
		}
	}, err=>{
		console.log(err)
		res.status(500).json({success: false, data: []});
	})
}

module.exports = {
	authenticate,
	getUserSessionData,
	sendAndUpdatePassword
};