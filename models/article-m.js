const connection = require('../db/client');

const fetchArticleById = (article_id) => {

//     return connection.select('article.*')
//     .from('article')
//     .leftJoin('comment', 'article.article_id', '=', 'comment.article_id')
//     .count({comment_count: 'comment_id'})
//     .groupBy('article.article_id')
//     .then(article => {
//             if(!article.length){
//                 return Promise.reject({
//                     status: 404,
//                     msg: 'article not found'
//                 })
//             }
//             else {
//             //table[0].comment_count = count[0].count;
//             console.log({article: article[0]})
//             return {article: article[0]};
//             }
//         })
// }
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
    if(inc_votes === undefined){
        return Promise.reject({
            status:400,
             msg: 'nothing to patch'
        })
    } else {

    return  connection('article')
    .where('article_id', '=', article_id)
    .increment('votes', inc_votes)
    .returning('*')
    .then(article => {
        if(!article.length){
            return Promise.reject({
                status:404,
                 msg: 'article not found'
            })
        } else {
        return {article: article[0]}
        }
    })
  }
}
        




module.exports = {fetchArticleById, updateArticleById};