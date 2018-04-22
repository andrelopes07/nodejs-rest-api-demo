let express = require('express');
let db = require('./db');
let AuthController = require('./auth/AuthController');
let UserController = require('./user/UserController');

let app = express();
app.use('/api/users', UserController);
app.use('/api/auth', AuthController);

module.exports = app;