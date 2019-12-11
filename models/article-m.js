const connection = require('../db/client');

const fetchArticleById = (article_id) => {

    return connection.select('article.*')
    .from('article')
    .where('article.article_id', '=', article_id)
    .leftJoin('comment', 'comment.article_id', '=', 'article.article_id')
    .count({comment_count: 'comment.article_id'})
    .groupBy('article.article_id')
    .then(article => {
            if(!article.length){
                return Promise.reject({
                    status: 404,
                    msg: 'article not found'
                })
            }
            else {
            console.log({article: article[0]})
            return {article: article[0]};
            }
        })
}


const updateArticleById = (inc_votes, article_id) => {
    if(inc_votes === undefined){
        return Promise.reject({
            status:400,
             msg: 'Post violates non null constraints'
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

const insertComment = (body, username, article_id, invalid) => {
    if(body === undefined || username === undefined){
        return Promise.reject({
            status:400,
             msg: 'Post violates non null constraints'
        })
    }
    if (Object.keys(invalid).length != 0) {
		return Promise.reject({ status: 400, msg: 'Column does not exist' });
	} else {
return connection
.into('comment')
.insert({'article_id': article_id, 'body': body,  'author': username})
.returning('*')
.then(comment => {
    return {comment: comment[0]};  
})
}
}

const fetchCommentsByArticleId = (article_id, sort_by = 'created_at', order = 'desc') => {
    const validOrders = ['asc', 'desc'];
    if (!validOrders.includes(order)) {
		return Promise.reject({ status: 400, msg: 'Invalid order value' });
	} else {
    return connection
    .from('comment')
    .where('article_id', '=', article_id)
    .orderBy(sort_by, order)
    .select('comment_id', 'votes', 'created_at', 'author', 'body')
    .then(comment => {
        if(!comment.length){
            return Promise.reject({
                status:404,
                 msg: 'comments not found'
            })
        } else {
        return {comments : comment}
        }
    })
}
}

const fetchArticles = () => {
    
}

        




module.exports = {
    fetchArticleById, 
    updateArticleById, 
    insertComment, 
    fetchCommentsByArticleId};