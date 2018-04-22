let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser');
let bcrypt = require('bcryptjs');

let VerifyToken = require('../auth/VerifyToken');
let User = require('./User');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// RETURNS ALL THE USERS IN THE DATABASE
router.get('/', VerifyToken, (req, res) => {
  User.find({}, (err, users) => {
    if (err) return res.status(500).send("There was a problem finding the users.");
    res.status(200).send(users);
  });
});

// GETS A SINGLE USER FROM THE DATABASE
router.get('/:id', VerifyToken, (req, res) => {
  User.findById(req.params.id, (err, user) => {
    if (!user) return res.status(404).send("No user found.");
    if (err) return res.status(500).send("There was a problem finding the user.");
    res.status(200).send(user);
  });
});

// UPDATES A SINGLE USER IN THE DATABASE
router.put('/:id', VerifyToken, (req, res) => {
  let hashedPassword = bcrypt.hashSync(req.body.password, 8);
  req.body.password = hashedPassword;

  User.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, user) => {
    if (!user) return res.status(404).send("No user found.");
    if (err) return res.status(500).send("There was a problem updating the user.");
    res.status(200).send(user);
  });
});

// DELETES A USER FROM THE DATABASE
router.delete('/:id', VerifyToken, (req, res) => {
  User.findByIdAndRemove(req.params.id, (err, user) => {
    if (!user) return res.status(404).send("No user found.");
    if (err) return res.status(500).send("There was a problem deleting the user.");
    res.status(200).send("User "+ user.name +" was deleted.");
  });
});

module.exports = router;