const { 
    fetchArticleById,
    updateArticleById,  
    insertComment, 
    fetchCommentsByArticleId, 
    fetchArticles} = require('../models/article-m');

exports.getArticleById = (req, res, next) => {
    const article_id = req.params.article_id
    fetchArticleById(article_id)
    .then(article => {
        
        res.status(200).send(article)
    })
    .catch(err => 
        next(err))
};

exports.patchArticleById = (req, res, next) => {
    const {inc_votes} = req.body;
    const article_id = req.params.article_id;

    updateArticleById(inc_votes, article_id)
    .then(article => {
        res.status(200).send(article)
})
.catch( err => 
    next(err))
};

exports.postComment = (req, res, next) => {
   const {body, username, ...invalid} = req.body
   const article_id = req.params.article_id
    insertComment(body, username, article_id, invalid)
    .then(comment => {
        res.status(201).send(comment);
    })
    .catch(err => {
        next(err);
    })
};

exports.getCommentsByArticleId = (req, res, next) => {
    const article_id = req.params.article_id
    const {sort_by, order} = req.query;
    fetchCommentsByArticleId(article_id, sort_by, order)
    .then(comments => {
        res.status(200).send(comments);
    }).catch(err => {
        next(err);
    })
};

exports.getArticles = (req, res, next) => {
 const {sort_by, order, author, topic, ...invalidColumn } = req.query;
    fetchArticles(sort_by, order, author, topic, invalidColumn)
    .then(articles => {
        res.status(200).send(articles)
    })
    .catch(err => 
        next(err))
};
   
