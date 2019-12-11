
const {updateCommentsById} = require('../models/comment-m');

exports.patchCommentsById = (req, res, next) => {
    const {inc_votes} = req.body;
    const comment_id = req.params.comment_id;
    
    updateCommentsById(inc_votes, comment_id)
    .then(comments => {
        res.status(200).send(comments)
    })
    .catch( err => next(err))
};