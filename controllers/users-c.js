const {fetchUserbyUsername} = require('../models/users-m');

exports.getUserByUsername = (req, res, next) => {
    const username = req.params.username;
    
    fetchUserbyUsername(username)
    .then(user => {
        res.status(200).send(user)
    })
    .catch(err => 
        next(err));
}