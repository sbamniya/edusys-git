const express = require('express');
const router = express.Router();
const authController = require('./controllers/auth');
const userController = require('./controllers/user');


router.post('/auth/login', authController.authenticate);
router.get('/auth/get-session', authController.getUserSessionData);

/**/
router.get('/users', userController.getAllUsers);
router.get('/users/active', userController.getActiveUsers);
router.post('/users', userController.createUser);
router.delete('/users/:userId', userController.deleteUser);

module.exports = router;