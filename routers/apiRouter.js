const apiRouter = require('express').Router();
const { topicRouter } = require('./topicRouter');
const { userRouter } = require('./usersRouter');
const { articleRouter } = require('./articleRouter');

apiRouter.use('/topic', topicRouter);

apiRouter.use('/users', userRouter)

apiRouter.use('/article', articleRouter);


module.exports = {apiRouter};