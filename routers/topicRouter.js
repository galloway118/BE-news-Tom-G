const topicRouter = require('express').Router();

const { getTopics } = require('../controllers/topic-c');

const {badRequest} = require('../controllers/error-c');

topicRouter
.route('/')
.get(getTopics)
.all(badRequest);

module.exports = {topicRouter};