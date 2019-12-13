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
            return {article: article[0]};
            }
        })
}

const updateArticleById = (inc_votes = 0, article_id) => {
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

const insertComment = (body, username, article_id, invalid) => {
    if(body === undefined || username === undefined){
        return Promise.reject({
            status:400,
             msg: 'Post violates non null constraints'
        })
    }
    if (Object.keys(invalid).length != 0) {
		return Promise.reject({ status: 404, msg: 'Column/id does not exist' });
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
    const comments = connection
    .from('comment')
    .where('article_id', '=', article_id)
    .orderBy(sort_by, order)
    .select('comment_id', 'votes', 'created_at', 'author', 'body');

    const articleArr = connection
    .from('article')
    .where('article_id', '=', article_id)
    .select('*');

    return Promise.all([comments, articleArr])
    
    .then(([comments, articleArr]) => {
        if(!articleArr.length ){
            return Promise.reject({
                status:404,
                 msg: 'article_id does not exist'
            })
        } else {
        return {comments: comments}
        }
    })
}
}

const fetchArticles = (sort_by = 'created_at', 
order = 'desc', author, topic, invalidColumn) => {
    const validOrders = ['asc', 'desc'];
    if (!validOrders.includes(order)) {
		return Promise.reject({ status: 400, msg: 'Invalid order value' });
    };
    if (Object.keys(invalidColumn).length != 0) {
		return Promise.reject({ status: 400, msg: 'Column does not exist' });
	} else {

    const articleArr = connection.select(
     'article.author', 'article.title', 'article.article_id', 'article.topic', 'article.created_at', 'article.votes')
    .from('article')
    .leftJoin('comment', 'comment.article_id', '=', 'article.article_id')
    .count({comment_count: 'comment.article_id'})
    .groupBy('article.article_id')
    .orderBy(sort_by, order)
    .modify(query => {
      if(author)return query.where('article.author', '=', author)
    })
    .modify(query => {
        if(topic) return query.where('topic', '=', topic)
    });
  
    const authors = author?  checkQuery('users', 'username', author): null;
    const topics = topic? checkQuery('topic', 'slug', topic): null;
  

    return Promise.all([ topics, authors, articleArr])
    .then(([ topics, authors, articleArr]) => {
        
         if (topics ) {
            return Promise.reject({ status: 404, msg: 'No articles found' });
        }
        else if(authors) {
            return Promise.reject({ status: 404, msg: 'No articles found' });
        }
        else {
            return {articles: articleArr}
        }
     })
    }
}

    const checkQuery = (table, columnName, query) => {
        console.log(table, columnName, query)
        return connection(table)
        .select('*')
        .where(columnName, '=', query)
        .then(response => {
            return response.length === 0
        })
    }
 

module.exports = {
    fetchArticleById, 
    updateArticleById, 
    insertComment, 
    fetchCommentsByArticleId,
    fetchArticles};