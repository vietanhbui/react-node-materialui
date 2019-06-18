const User = require('../model/user');
const _ = require('lodash');
const formidable = require('formidable');
const fs = require('fs')

exports.getUserById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({ error: 'User not found!' });
        }
        req.profile = user;
        next();
    });
};

exports.getAllUsers = (req, res) => {
    User.find((err, users) => {
        if (err) {
            return res.json({ error: err });
        }
        return res.json({ users });
    }).select('_id name email created');
};

exports.getUser = (req, res) => {
    req.profile.hash_password = undefined;
    req.profile.salt = undefined;
    return res.json(req.profile);
};

exports.updateUser = (req, res) => {
    let form = formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({ error: 'Photo could not be upload' })
        }
        // save user
        let user = req.profile;
        user = _.assignIn(user, fields);
        user.update = Date.now();
        if (files.photo) {
            user.photo.data = fs.readFileSync(files.photo.path);
            user.photo.contentType = files.photo.type;
        }
        user.save((err, result) => {
            if (err) {
                return res.status(400).json({ error: err });
            }
            user.hash_password = undefined;
            user.salt = undefined;
            res.json({ user });
        })
    });
};

exports.deleteUser = (req, res) => {
    let user = req.profile;
    User.deleteOne({ email: user.email }, err => {
        if (err) {
            return res.status(400).json({ error: err });
        }
        res.json({ message: 'User delete successfully' });
    });
};

exports.hasAuthorization = (req, res, next) => {
    const authorized =
        req.profile && req.auth && req.profile._id == req.auth._id;
    if (!authorized) {
        return res.status(403).json({
            error: 'User is not authorized to perform this action'
        });
    }
    next();
};

exports.userPhoto = (req, res, next) => {
    if (req.profile.photo.data) {
        res.set('Content-Type', req.profile.photo.contentType);
        return res.send(req.profile.photo.data);
    }
    next();
}
