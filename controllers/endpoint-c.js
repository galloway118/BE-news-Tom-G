const  {fetchEndpoints} = require('../models/endpoint-m');

exports.getEndPoints = (req, res, next) => {
    return res.status(200).send(fetchEndpoints)

    }
 