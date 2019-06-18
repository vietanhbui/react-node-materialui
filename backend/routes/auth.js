const express = require('express');
const router = express.Router();
const { signup, signin, signout } = require('../controller/auth');
const { userSignupValidator } = require('../helper/validator');
const { getUserById } = require('../controller/user');

router.post('/signup', userSignupValidator, signup);
router.post('/signin', signin);
router.get('/signout', signout);

router.param('userId', getUserById);

module.exports = router;