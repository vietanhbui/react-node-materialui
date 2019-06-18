const express = require('express');
const app = express();
const fs = require('fs');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator')

const postRoutes = require('./routes/post');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

dotenv.config();

// Database
mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true });

var connection = mongoose.connection;
connection.on('connected', () => {
    console.log('DB connected');
})

connection.on('error', err => {
    console.log('DB connection error', err);
})

connection.on('disconnected', () => {
    console.log('DB disconnected');
});

// Api
app.get('/api', (req, res) => {
    fs.readFile('docs/apiDocs.json', (err, data) => {
        if (err) {
            res.status(400).json({ error: err });
        }
        const docs = JSON.parse(data);
        res.json({ docs });
    })
})

// Middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());

app.use('/api', postRoutes);
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).send('Unauthorized');
    }
});

// Run
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log('Server is running at ' + port);
})