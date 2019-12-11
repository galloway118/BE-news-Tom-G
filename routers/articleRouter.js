const articleRouter = require('express').Router();

const {getArticleById, patchArticleById, postComment} = require('../controllers/article-c');

const {badRequest} = require('../controllers/error-c');

articleRouter.route('/:article_id')
.get(getArticleById)
.patch(patchArticleById)
.all(badRequest);

articleRouter.route('/:article_id/comments')
.post(postComment);

module.exports = {articleRouter};