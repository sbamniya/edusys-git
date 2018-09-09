const user = require('./../models/users');
const common = require('./../common');

const getAllUsers = (req, res, next) => {
	var limit = req.query && req.query.limit ? parseInt(req.query.limit) : 10;
	var page = req.query && req.query.page ? parseInt(req.query.page) : 1;
	var offset = limit * (page - 1);
	var isActiveNeeded = req.query && req.query.isActive ? req.query.isActive : 0;
	var searchKey = req.query && req.query.search ? req.query.search : null;
	var condition = {};
	if (isActiveNeeded) {
		condition['isActive'] = 1;
	}
	if (searchKey) {
		condition['email'] = new RegExp("^"+ searchKey);
	}
	user.find(condition).where('userRole').ne(1).skip(offset).limit(limit).sort({createdAt: -1}).then(data=>{
		user.count(condition).where('userRole').ne(1).then(count=>{
			res.status(200).json({success: true, data: data, count: count});
		})
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
	var userId = req.params.userId ? req.params.userId : null;
	if (userId === null) {
		res.status(422).json({success: false, message: 'Invalid user!'});
		return;
	} 
	if (!common.isValidObjectId(userId)) {
	  res.status(400).json({success: false, message: 'Invalid user!'});
	  return;
	}
	user.findByIdAndRemove(userId, data=>{
		console.log('user deleted successfully');
		res.status(200).json({success: true, message: 'User deleted successfully!'});
	});
}

module.exports = {
	getAllUsers,
	createUser,
	deleteUser
};