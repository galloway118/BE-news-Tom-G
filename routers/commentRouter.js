const commentRouter = require('express').Router();

const {patchCommentsById} = require('../controllers/comment-c');

commentRouter.route('/:comment_id')
.patch(patchCommentsById);

module.exports = {commentRouter};