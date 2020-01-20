const { fetchUserbyUsername, fetchAllUsers } = require('../models/users-m');

exports.getUserByUsername = (req, res, next) => {
  const username = req.params.username;

  fetchUserbyUsername(username)
    .then(user => {
      res.status(200).send(user);
    })
    .catch(err => next(err));
};

exports.getUsers = (req, res, next) => {
  fetchAllUsers().then(users => {
    res.status(200).send(users);
  });
};
