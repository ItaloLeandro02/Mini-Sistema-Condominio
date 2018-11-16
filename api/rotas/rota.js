//Express é o servidor HTTP
let rota = require('express').Router();


//definindo controllers
//Pessoa
let pessoaController = require('../recursos/pessoa.controller');

//Usuário
let usuarioController = require('../recursos/usuario.controller');

//Porteiro
let porteiroController = require('../recursos/porteiro.controller');

//Definindo as rotas 
//Pessoa
rota.get('/pessoa', pessoaController.carregaTudo);
rota.get('/pessoa/:id', pessoaController.carregaPorId);
rota.post('/pessoa', pessoaController.salva);
rota.delete('/pessoa/:id', pessoaController.exclui);
rota.put('/pessoa/:id', pessoaController.atualiza);

//Usuário
rota.get('/usuario', usuarioController.carregaTudo);
rota.get('/usuario/:id', usuarioController.carregaPorId);
rota.post('/usuario', usuarioController.salva);
rota.delete('/usuario/:id', usuarioController.exclui);
rota.put('/usuario/:id', usuarioController.atualiza);

//Porteiro
rota.get('/porteiro', porteiroController.carregaTudo);
rota.get('/porteiro/:id', porteiroController.carregaPorId);
rota.post('/porteiro', porteiroController.salva);
rota.delete('/porteiro/:id', porteiroController.exclui);
rota.put('/porteiro/:id', porteiroController.atualiza);



module.exports = rota;