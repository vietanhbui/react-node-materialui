const mongoose = require('mongoose');
const crypto = require('crypto');
const uuidv1 = require('uuid/v1');
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        trim: true
    },
    email: {
        type: String,
        require: true,
        trim: true
    },
    hash_password: {
        type: String,
        require: true
    },
    salt: String,
    created: {
        type: Date,
        default: Date.now()
    },
    update: Date,
    photo: {
        data: Buffer,
        contentType: String
    },
    following: [{
        type: ObjectId,
        ref: "User"
    }],
    followers: [{
        type: ObjectId,
        ref: "User"
    }],
    resetPasswordLink: {
        data: String,
        default: '',
    }
});

userSchema.virtual('password')
    .set(function (password) {
        this._password = password;
        this.salt = uuidv1();
        this.hash_password = this.encryptPassword(password);
    })
    .get(function () {
        return this._password;
    });

userSchema.methods = {
    authenticate: function (plainText) {
        return this.encryptPassword(plainText) === this.hash_password;
    },

    encryptPassword: function (password) {
        if (!password) return '';
        try {
            return crypto.createHmac('sha256', this.salt).update(password).digest('hex');
        } catch (error) {
            return '';
        }
    }
}

module.exports = mongoose.model('User', userSchema)