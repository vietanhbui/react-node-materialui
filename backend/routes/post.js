const express = require('express');
const router = express.Router();
const {
    getPosts,
    createPost,
    getPostsByUser,
    getPostById,
    getPost,
    updatePost,
    deletePost,
    isPoster,
    postPhoto,
    comment,
    uncomment,
    like, 
    unlike
} = require('../controller/post');
const { createPostValidator } = require('../helper/validator');
const { getUserById } = require('../controller/user');
const { requireSignin } = require('../controller/auth');

router.get('/posts', requireSignin, getPosts);

// comment,uncomment
router.put('/post/comment', requireSignin, comment);
router.put('/post/uncomment', requireSignin, uncomment);

// like, unlike
router.put('/post/like', requireSignin, like);
router.put('/post/unlike', requireSignin, unlike);

router.get('/posts/by/:userId', getPostsByUser);
router.get('/post/:postId', getPost);
router.post(
    '/post/new/:userId',
    requireSignin,
    createPost,
    createPostValidator
);
router.put('/post/:postId', requireSignin, isPoster, updatePost);
router.delete('/post/:postId', requireSignin, isPoster, deletePost);

// photo
router.get('/post/photo/:postId', postPhoto);

router.param('userId', getUserById);
router.param('postId', getPostById);

module.exports = router;
