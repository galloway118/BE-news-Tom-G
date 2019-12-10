const userRouter = require('express').Router();

const {getUserByUsername} = require('../controllers/users-c');

const {badRequest} = require('../controllers/error-c');

userRouter
.route('/:username')
.get(getUserByUsername)
.all(badRequest);

module.exports = {userRouter};