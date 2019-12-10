const {fetchTopics} = require('../models/topic-m');

exports.getTopics = (req, res, next) => {
    fetchTopics()
    .then((response) => {
    res.status(200).send(response);
})
.catch(err => {
    next(err);})
};


