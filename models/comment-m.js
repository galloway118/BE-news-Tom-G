const connection = require('../db/client');

const updateCommentsById = (inc_votes = 0, comment_id) => {
    return  connection('comment')
    .where('comment_id', '=', comment_id)
    .increment('votes', inc_votes)
    .returning('*')
    .then(comment => {
        if(!comment.length){
            return Promise.reject({
                status:404,
                 msg: 'comment not found'
            })
        } else {
        return {comment: comment[0]}
        }
    })
}

const removeCommentById = (comment_id) => {
    return connection('comment')
    .where('comment_id', '=', comment_id)
    .del()
    .then(comment => {
        
        if(!comment){
           return Promise.reject({
               status: 404,
               msg: 'comment_id not found'
           })
        } else { return comment 
        }
    })

}


module.exports = {updateCommentsById, removeCommentById};