const tag = require('./../models/tags');
const { validationResult } = require('express-validator/check');
const common = require('./../common');
const fs = require('fs');

const getAllTags = (req, res, next) => {
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
		condition['tagName'] = new RegExp("^"+ searchKey);
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
	var tagFileUpload = common.upload.single('tagFile');
	tagFileUpload(req, res, (err, file)=>{
		if (err) {
			return res.status(500).json({message: 'Unable to upload file !'});
		}
		var $data = req.body;
		var isError = false;
		var errMsg = '';
		if (!$data.tagName || $data.tagName.length<10){
			errMsg +='Tag name can be at 10 to 120 character long.';
			isError = true;
		}
		if (!req.file || !req.file.filename) {
			errMsg += 'Tag File should be included with tag.'
			isError = true;
		}
		if(!$data.tagDescription || $data.tagDescription.length<20) {
			errMsg +='<br>Tag description should be at least 20 character long.';	
			isError = true;	
		}

		if (isError) {
			if (req.file && req.file.filename) {
				fs.unlink(req.file.path);			
			}
			return res.status(422).json({message: errMsg});
		}

		$data.createdIp = common.getIpAddress(req);
		$data.isActive = 1;
		$data.createdBy = (req.session && req.session.userData && req.session.userData.id) ? req.session.userData.id : null;
		$data.fileUrl = req.file.path;
		const newTag = new tag($data);

		newTag.save().then(data => {
			console.log('user created successfully !');
			res.status(200).json({success: true, data: data, message: 'Tag created successfully!'})
		}, err => {
			console.log('Error occure while creatiing user !');
			res.status(500).json({success: false, data: []});
		});
	})	
}

const getTagDetails = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({message: common.formatValidationErr(errors.mapped(), true)});
	}
	var tagId = req.body.tagId;
	if (!common.isValidObjectId(tagId)) {
	  res.status(400).json({success: false, message: 'Invalid tag!'});
	  return;
	}
	try{
		tag.findById(tagId).then(data=>{
			res.status(200).json({success: true, data: data, message: 'Tag Details fetched successfully!'})
		});
	}catch(e){
		res.status(500).json({success: false, message: 'Invalid tag!'})
	}
}

const deleteTag = (req, res, next) => {
	var tagId = req.params.tagId ? req.params.tagId : null;
	if (tagId === null) {
		res.status(422).json({success: false, message: 'Invalid tag!'});
		return;
	} 
	if (!common.isValidObjectId(tagId)) {
	  res.status(400).json({success: false, message: 'Invalid tag!'});
	  return;
	}
	tag.findByIdAndRemove(tagId, data=>{
		console.log('tag deleted successfully');
		res.status(200).json({success: true, message: 'Tag deleted successfully!'});
	});
}

module.exports = {
	getAllTags,
	createTag,
	deleteTag,
	getTagDetails
};