exports.badRequest = (req, res, next) => {
	res.status(405).send({ msg: 'Method not allowed' });
};

exports.handlePsqlErrors = (err, req, res, next) => {
    if(err.status){
        next(err);
    } else {
            const psqlErr = { 
                '22P02': [400, 'Invalid input type'],
                '23503': [404, 'request not valid'],
                '42703': [400, 'Invalid query']   
            };
            if (Object.keys(psqlErr).includes(err.code)) {
                res.status(psqlErr[err.code][0]).send({ msg: psqlErr[err.code][1] });
            } else {
    
                res.status(500).send({ msg: err.code });
            }
    }
};

exports.handleCustomErrors = (err, req, res, next) => {
    if(err.status){
        res.status(err.status).send({msg: err.msg})
    } else {
        next(err);
    }
}