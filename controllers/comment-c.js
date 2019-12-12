
const {updateCommentsById, removeCommentById} = require('../models/comment-m');

exports.patchCommentsById = (req, res, next) => {
    const {inc_votes} = req.body;
    const comment_id = req.params.comment_id;
    
    updateCommentsById(inc_votes, comment_id)
    .then(comments => {
        res.status(200).send(comments)
    })
    .catch( err => next(err))
};

exports.deleteComment = (req, res, next) => {
const {comment_id} = req.params;
    removeCommentById(comment_id)
    .then(() => {
        res.status(204).send({})
    })
    .catch(err => next(err))
};