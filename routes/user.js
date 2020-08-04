const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const validateEmail = require('../middleware/validateEmail');
const validatePwd = require('../middleware/validatePwd');

router.post('/signup', validateEmail, validatePwd, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;