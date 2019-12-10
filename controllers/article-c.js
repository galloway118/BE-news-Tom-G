const { fetchArticleById, updateArticleById} = require('../models/article-m');

exports.getArticleById = (req, res, next) => {
    const article_id = req.params.article_id
    fetchArticleById(article_id)
    .then(article => {
        
        res.status(200).send(article)
    })
    .catch(err => 
        //console.log(err, 'in the controller'))
        next(err))
};

exports.patchArticleById = (req, res, next) => {
    //const votes = req.params.votes;
    //console.log(req.params);
    const {inc_votes} = req.body;
    const article_id = req.params.article_id;
    //console.log(article_id);
    updateArticleById(inc_votes, article_id)
    .then(article => {
        res.status(200).send(article)
})
.catch( err => 
    next(err))
};
