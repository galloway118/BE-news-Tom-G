const apiRouter = require('express').Router();
const { topicRouter } = require('./topicRouter');
const { userRouter } = require('./usersRouter');
const { articleRouter } = require('./articleRouter');
const {commentRouter} = require('./commentRouter');

apiRouter.use('/topic', topicRouter);

apiRouter.use('/users', userRouter);

apiRouter.use('/comment', commentRouter);

apiRouter.use('/article', articleRouter);


module.exports = {apiRouter};