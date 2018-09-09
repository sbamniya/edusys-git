const express = require('express');
const router = express.Router();
const { body } = require('express-validator/check');

const authController = require('./controllers/auth');
const userController = require('./controllers/user');
const tagController = require('./controllers/tags');
const validations = require('./common/validations');

/**/
router.post('/auth/login', validations.loginValidation, authController.authenticate);
router.post('/auth/update-password', validations.updatePasswordValidation, authController.sendAndUpdatePassword);
router.get('/auth/get-session', authController.getUserSessionData);

/**/
router.get('/users', userController.getAllUsers);
router.post('/users', userController.createUser);
router.delete('/users/:userId', userController.deleteUser);

/**/
router.get('/tags', tagController.getAllTags);
router.post('/tags', tagController.createTag);
router.post('/tag/details', validations.getTagDetailsValidation, tagController.getTagDetails);
router.delete('/tag/:tagId', tagController.deleteTag);

module.exports = router;