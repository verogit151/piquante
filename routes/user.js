const express = require('express');
const rateLimit = require("express-rate-limit");

const router = express.Router();
const userCtrl = require('../controllers/user');
const validatePwd = require('../middleware/validatePwd');

const createAccountLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 3, // blocage après 3 tentatives
    message: "Trop de tentatives infructueuses"
});

router.post('/signup', validatePwd, userCtrl.signup);
router.post('/login', createAccountLimiter, userCtrl.login);

module.exports = router;