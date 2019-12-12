const express = require('express');
const {apiRouter} = require('./routers/apiRouter');
const server = express();

server.use(express.json());

server.use('/api', apiRouter);

server.all('/*', (req, res, next) => {
    res.status(404).send({msg: 'Endpoint does not exist'});
});

server.use((err, req, res, next) => {
    //console.log(err);
    if(err.status){
        next(err);
    } else {
            const psqlErr = { 
                '22P02': [400, 'Invalid input type'],
                '23503': [400, 'request not valid'],
                '42703': [400, 'Invalid query']   
            };
            if (Object.keys(psqlErr).includes(err.code)) {
                res.status(psqlErr[err.code][0]).send({ msg: psqlErr[err.code][1] });
            } else {
    
                res.status(500).send({ msg: err.code });
            }
    }
});

server.use((err, req, res, next) => {
    if(err.status){
        res.status(err.status).send({msg: err.msg})
    } else {
        next(err);
    }
})
module.exports = {server};