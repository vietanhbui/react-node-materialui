const express = require('express');
const router = express.Router();
const { hasAuthorization, getAllUsers, getUserById, getUser, updateUser, deleteUser, userPhoto } = require('../controller/user');
const { requireSignin } = require('../controller/auth')

router.get('/users', getAllUsers);
router.get('/user/:userId', getUser);

router.put('/user/:userId', requireSignin, hasAuthorization, updateUser);
router.delete('/user/:userId', requireSignin, hasAuthorization, deleteUser);

// photo
router.get('/user/photo/:userId', userPhoto);

router.param('userId', getUserById);

module.exports = router;