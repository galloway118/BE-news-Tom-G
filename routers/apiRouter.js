const apiRouter = require('express').Router();
const { topicRouter } = require('./topicRouter');
const { userRouter } = require('./usersRouter');
const { articleRouter } = require('./articleRouter');
const { commentRouter } = require('./commentRouter');
const { getEndPoints } = require('../controllers/endpoint-c');

//apiRouter.use('/', getEndPoints)

apiRouter.use('/topics', topicRouter);

apiRouter.use('/users', userRouter);

apiRouter.use('/comments', commentRouter);

apiRouter.use('/articles', articleRouter);


module.exports = {apiRouter};