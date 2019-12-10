const connection = require('../db/client');

const fetchArticleById = (article_id) => {
    const table = connection('article')
    .select('*')
    .where('article_id', '=', article_id);

    const count = connection('comment')
    .count('article_id')
    .where('article_id', '=', article_id);

    return Promise.all([table, count])
    .then(([table, count]) => {
        if(!table.length){
            return Promise.reject({
                status: 404,
                msg: 'article not found'
            })
        }
        else {
        table[0].comment_count = count[0].count;
        return {article: table[0]};
        }
    })
}

const updateArticleById = (inc_votes, article_id) => {
        
    const articleObj =  connection('article')
    .where('article_id', '=', article_id)
    // .update('votes', votes)
    .returning('*')
    return Promise.all([inc_votes, articleObj])
    .then(([inc_votes, articleObj]) => {
        articleObj[0].votes = articleObj[0].votes + inc_votes;
        //console.log({article: articleObj[0]})
        return {article: articleObj[0]}
    })
}




module.exports = {fetchArticleById, updateArticleById};