let express = require('express');
let bodyParser = require('body-parser');
let jwt = require('jsonwebtoken');
let bcrypt = require('bcryptjs');
let config = require('../config');
let VerifyToken = require('./VerifyToken');
let User = require('../user/User');

let router = express.Router();
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// USER REGISTER
router.post('/register', (req, res) => {
  let hashedPassword = bcrypt.hashSync(req.body.password, 8);
  
  User.create({
    name : req.body.name,
    email : req.body.email,
    password : hashedPassword
  }, (err, user) => {
    if (err) return res.status(500).send('There was a problem registering the user.')
    // Create a token
    let token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 86400 // Expires in 24 hours
    });
    res.status(200).send({ auth: true, token: token });
  }); 
});

// USER LOGIN
router.post('/login', (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) return res.status(404).send('No user found.');
    if (err) return res.status(500).send('Error on the server.');

    let passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

    let token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 86400 // Expires in 24 hours
    });
    res.status(200).send({ auth: true, token: token });
  });
});

// 'DUMMY' LOGOUT ROUTE
router.get('/logout', (req, res) => {
  res.status(200).send({ auth: false, token: null });
});

// ROUTE TO GET LOGGED USER DATA
router.get('/me', VerifyToken, (req, res, next) => {
  
  User.findById(req.userId, { password: 0 }, (err, user) => {
    if (!user) return res.status(404).send('No user found.');
    if (err) return res.status(500).send('There was a problem finding the user.');
    res.status(200).send(user);
  });
});

module.exports = router;