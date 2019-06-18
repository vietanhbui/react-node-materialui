exports.createPostValidator = (req, res, next) => {
    req.check('content', 'Content must be between 4 to 2000 characters').isLength({ min: 4, max: 2000 });

    const errors = req.validationErrors();
    if (errors) {
        let firstError = errors.map(err => err.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    next();
}

exports.userSignupValidator = (req, res, next) => {
    req.check('name', 'Please enter your name.').notEmpty();
    req.check('email', 'Email invalid.').matches(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    req.check('password', 'Password must contain at least one number.').matches(
        /.*[0-9].*/
    );
    req.check('password', 'Password must be between 8 to 150 characters').isLength({ min: 8, max: 150 });
    const errors = req.validationErrors();
    if (errors) {
        let firstError = errors.map(err => err.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    next();
};