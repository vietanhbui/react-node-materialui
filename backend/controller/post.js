const Post = require('../model/post');
const formidable = require('formidable');
const fs = require('fs');
const _ = require('lodash');

exports.getPosts = (req, res, next) => {
    Post.find()
        .populate('postedBy', '_id name')
        .populate('comments.postedBy', '_id name')
        .then(posts => {
            return res.json(posts);
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getPostById = (req, res, next, id) => {
    Post.findById(id)
        .populate('postedBy', '_id name')
        .populate('comments.postedBy', '_id name')
        .exec((err, post) => {
            if (err || !post) {
                return res.status(400).json({ error: err });
            }
            req.post = post;
            next();
        });
};

exports.getPost = (req, res) => {
    return res.json(req.post);
};

exports.createPost = (req, res, next) => {
    let form = formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res
                .status(400)
                .json({ error: 'Image could not be uploaded!' });
        }
        let post = new Post(fields);
        post.postedBy = req.profile;
        if (files.photo) {
            console.log(post);
            post.photo.data = fs.readFileSync(files.photo.path);
            post.photo.contentType = files.photo.type;
        }
        post.save((err, result) => {
            if (err) {
                return res.status(400).json({ error: err });
            }
            return res.json(result);
        });
    });
};

exports.getPostsByUser = (req, res) => {
    Post.find({ postedBy: req.profile._id })
        .populate('postedBy', '_id name')
        .populate('comments.postedBy', '_id name')
        .exec((err, posts) => {
            if (err) {
                return res.status(400).json({ error: err });
            }
            return res.json({ posts });
        });
};

exports.isPoster = (req, res, next) => {
    let isPoster =
        req.post && req.auth && req.post.postedBy._id == req.auth._id;
    if (!isPoster) {
        return res
            .status(400)
            .json({ error: 'User is not authorized to perform this action' });
    }
    next();
};

exports.updatePost = (req, res) => {
    let form = formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({ error: 'Photo could not be upload' });
        }
        // save post
        let post = req.post;
        post = _.assignIn(post, fields);
        post.update = Date.now();
        if (files.photo) {
            post.photo.contentType = files.photo.type;
            post.photo.data = fs.readFileSync(files.photo.path);
        }
        post.save(err => {
            if (err) {
                return res.status(400).json({ error: err });
            }
            res.json({ post });
        });
    });
};

exports.deletePost = (req, res) => {
    let post = req.post;
    post.remove((err, post) => {
        if (err) {
            return res.status(400).json({ error: err });
        }
        res.json({ message: 'Post deleted successfully!' });
    });
};

exports.postPhoto = (req, res, next) => {
    if (req.post.photo.data) {
        res.set('Content-Type', req.post.photo.contentType);
        return res.send(req.post.photo.data);
    }
    next();
};

exports.comment = (req, res) => {
    let comment = req.body.comment;
    comment.postedBy = req.body.userId;
    Post.findByIdAndUpdate(
        req.body.postId,
        { $push: { comments: comment } },
        { new: true }
    )
        .populate('postedBy', '_id name')
        .populate('comments.postedBy', '_id name')
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({ error: err });
            }
            return res.json(result);
        });
};

exports.uncomment = (req, res) => {
    let comment = req.body.comment;
    Post.findByIdAndUpdate(
        req.body.postId,
        { $pull: { comments: { _id: comment._id } } },
        { new: true }
    )
        .populate('postedBy', '_id name')
        .populate('comments.postedBy', '_id name')
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({ error: err });
            }
            return res.json(result);
        });
};

exports.like = (req, res) => {
    Post.findByIdAndUpdate(
        req.body.postId,
        { $push: { likes: req.body.userId } },
        { new: true }
    )
        .populate('postedBy', '_id name')
        .populate('comments.postedBy', '_id name')
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({ error: err });
            }
            return res.json(result);
        });
};

exports.unlike = (req, res) => {
    Post.findByIdAndUpdate(
        req.body.postId,
        { $pull: { likes: req.body.userId } },
        { new: true }
    )
        .populate('postedBy', '_id name')
        .populate('comments.postedBy', '_id name')
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({ error: err });
            }
            return res.json(result);
        });
};
