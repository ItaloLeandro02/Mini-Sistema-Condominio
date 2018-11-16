//Express é o servidor HTTP
let rota = require('express').Router();



let pessoacontroller = require('../recursos/pessoa.controller');


rota.get('/pessoa', pessoacontroller.carregaTudo);
rota.get('/pessoa/:id', pessoacontroller.carregaPorId);
rota.post('/pessoa', pessoacontroller.salva)
rota.delete('/pessoa/:id', pessoacontroller.exclui)
rota.put('/pessoa/:id', pessoacontroller.atualiza)



module.exports = rota;