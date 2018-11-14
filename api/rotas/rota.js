let rota = require('express').Router();



let clienteRecurso = require('../recursos/cliente');


rota.get('/cliente', clienteRecurso.carregaTudo);
rota.get('/cliente/:id', clienteRecurso.carregaPorId);
rota.post('/cliente', clienteRecurso.salva)
rota.delete('/cliente/:id', clienteRecurso.exclui)
rota.put('/cliente/:id', clienteRecurso.atualiza)



module.exports = rota;