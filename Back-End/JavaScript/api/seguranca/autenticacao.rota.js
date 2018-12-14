const rota = require('express').Router();
const auth = require('./autenticacao');

rota.post('/api/autenticacao',auth.signUp);


module.exports = rota;

