const  {fetchEndpoints} = require('../models/endpoint-m');

exports.getEndpoints = (req, res, next) => {
    fetchEndpoints()
    .then(response => {
        res.status(200).send(response)
    })
    .catch(err => err(next))
};