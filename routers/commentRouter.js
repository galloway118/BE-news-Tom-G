const commentRouter = require('express').Router();

const {patchCommentsById, deleteComment} = require('../controllers/comment-c');

const {badRequest} = require('../controllers/error-c')

commentRouter.route('/:comment_id')
.patch(patchCommentsById)
.delete(deleteComment)
.all(badRequest);

module.exports = {commentRouter};