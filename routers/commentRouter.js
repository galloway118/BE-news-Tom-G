const commentRouter = require('express').Router();

const {patchCommentsById} = require('../controllers/comment-c');

const {badRequest} = require('../controllers/error-c')

commentRouter.route('/:comment_id')
.patch(patchCommentsById)
.all(badRequest);

module.exports = {commentRouter};