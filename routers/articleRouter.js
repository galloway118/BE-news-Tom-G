const articleRouter = require('express').Router();

const {getArticles, getArticleById, patchArticleById, postComment, getCommentsByArticleId} = require('../controllers/article-c');

const {badRequest} = require('../controllers/error-c');

articleRouter.route('/')
.get(getArticles)

articleRouter.route('/:article_id')
.get(getArticleById)
.patch(patchArticleById)
.all(badRequest);

articleRouter.route('/:article_id/comments')
.post(postComment).get(getCommentsByArticleId).all(badRequest);

module.exports = {articleRouter};