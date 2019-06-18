const User = require('../model/user');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const expressJwt = require('express-jwt');

dotenv.config();

exports.signup = async (req, res) => {
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists)
        return res.status(403).json({
            error: 'Email is taken'
        });
    const user = await new User(req.body);
    await user.save();
    res.status(200).json({ message: 'Signup success!' });
};

exports.signin = (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email: email }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'Please provide a valid email and password.'
            });
        }
        if (!user.authenticate(password)) {
            return res.status(400).json({
                error: 'Please provide a valid email and password.'
            });
        }
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        res.cookie('t', token, { expires: new Date(Date.now() + 900000) });
        const { _id, email, name } = user;
        return res.json({ token, user: { _id, email, name } });
    });
};

exports.signout = (req, res) => {
    res.clearCookie('t');
    return res.json({ message: 'Signout success!' });
};

exports.requireSignin = expressJwt({ secret: process.env.JWT_SECRET, userProperty: 'auth' });
