const userRouter = require('express').Router();

const {
  getUserByUsername,
  getUsers,
  postUser
} = require('../controllers/users-c');

const { badRequest } = require('../controllers/error-c');

userRouter
  .route('/')
  .get(getUsers)
  .all(badRequest);

userRouter
  .route('/:username')
  .get(getUserByUsername)
  .all(badRequest);

module.exports = { userRouter };
