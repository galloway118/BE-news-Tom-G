const express = require('express');
const {apiRouter} = require('./routers/apiRouter');
const server = express();
const {handlePsqlErrors, handleCustomErrors} = require('./controllers/error-c');
const cors = require('cors');

server.use(cors());

server.use(express.json());

server.use('/api', apiRouter);

server.all('/*', (req, res, next) => {
    res.status(404).send({msg: 'Endpoint does not exist'});
});

server.use(handlePsqlErrors);

server.use(handleCustomErrors);

module.exports = {server};