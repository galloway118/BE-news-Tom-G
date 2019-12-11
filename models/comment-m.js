const connection = require('../db/client');

const updateCommentsById = (inc_votes, comment_id) => {
    if(inc_votes === undefined){
        return Promise.reject({
            status:400,
             msg: 'Post violates non null constraints'
        })
    } else {
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
}


module.exports = {updateCommentsById};