const { body } = require('express-validator/check');

const loginValidation =  [
    body('email').isEmail().withMessage('Email must be a valid email.').trim(),
    body('password', 'Password must be at least 6 character long.').trim().isLength({min: 6})
];

const updatePasswordValidation =  [
    body('email').isEmail().withMessage('Email must be a valid email.').trim()
];

const createTagValidation = [
	body('tagName', 'Please enter tag name.').trim().isLength({min: 10, max: 120}).withMessage('Tag name can be at 10 to 120 character long.'),
  body('tagDescription').trim().isLength({min: 20}).withMessage('Tag description should be at least 20 character long.')

];

module.exports = {
    loginValidation,
    updatePasswordValidation,
    createTagValidation
}