const tag = require('./../models/tags');
const { validationResult } = require('express-validator/check');
const common = require('./../common');

const getAllTags = (req, res, next) => {
	var limit = req.query && req.query.limit ? parseInt(req.query.limit) : 10;
	var page = req.query && req.query.page ? parseInt(req.query.page) : 1;
	var offset = limit * (page - 1);
	var isActiveNeeded = req.query && req.query.isActive ? req.query.isActive : 0;
	var condition = {};
	if (isActiveNeeded) {
		condition['isActive'] = 1;
	}
	tag.find(condition).skip(offset).limit(limit).sort({createdAt: -1}).then(data=>{
		tag.count(condition).then(count=>{
			res.status(200).json({success: true, data: data, count: count});
		})
	}, err=>{
		console.log(err)
		res.status(500).json({success: false, data: []});
	})
}

const createTag = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({message: common.formatValidationErr(errors.mapped(), true)});
	}

	var $data = req.body;
	$data.createdIp = common.getIpAddress(req);
	$data.isActive = 1;
	$data.createdBy = (req.session && req.session.userData && req.session.userData.id) ? req.session.userData.id : null;
	const newTag = new tag($data);

	newTag.save().then(data => {
		console.log('user created successfully !');
		res.status(200).json({success: true, data: data, message: 'Tag created successfully!'})
	}, err => {
		console.log('Error occure while creatiing user !');
		res.status(500).json({success: false, data: []});
	});
}

const deleteTag = (req, res, next) => {
	
}

module.exports = {
	getAllTags,
	createTag,
	deleteTag
};