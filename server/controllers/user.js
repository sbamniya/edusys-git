const user = require('./../models/users');
const common = require('./../common');

const getAllUsers = (req, res, next) => {
	user.find({}).then(data=>{
		console.log(data);
		res.status(200).json({success: true, data: data});
	}, err=>{
		console.log(err)
		res.status(500).json({success: false, data: []});
	})
}

const getActiveUsers = (req, res, next) => {
	user.find({isActive: 1}).then(data=>{
		console.log(data);
		res.status(200).json({success: true, data: data});
	}, err=>{
		console.log(err)
		res.status(500).json({success: false, data: []});
	})
}

const createUser = (req, res, next) => {
	var salt = common.generateSalt(6);
	var $data = req.body;
	$data.salt = salt;
	$data.password = common.hashPassword($data.password, salt);
	$data.createdIp = common.getIpAddress(req);
	const newUser = new user($data);

	newUser.save().then(data => {
		console.log('user created successfully !');
		res.status(200).json({success: true, data: data})
	}, err => {
		console.log('Error occure while creatiing user !');
		res.status(500).json({success: false, data: []});
	});
}

const deleteUser = (req, res, next) => {
	user.find({}).then(data=>{
		console.log(data);
		res.status(200).json({success: true, data: data});
	}, err=>{
		console.log(err)
		res.status(500).json({success: false, data: []});
	})
}


module.exports = {
	getAllUsers,
	getActiveUsers,
	createUser,
	deleteUser
};