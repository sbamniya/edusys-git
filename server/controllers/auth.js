const user = require('./../models/users');
const common = require('./../common');

const authenticate = (req, res, next) => {
	var email = req.body.email;
	var password = req.body.password;

	user.findOne({email: email}).then(data=>{
		var response = {};
		var status = 404;
		var isSuccess = false;
		var message = 'User details not found!';
		if (data._id) {
			status = 403;
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

module.exports = {
	authenticate,
	getUserSessionData
};