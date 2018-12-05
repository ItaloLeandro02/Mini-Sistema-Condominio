//Express é o servidor HTTP
let rota = require('express').Router();


//definindo controllers
//Pessoa
let pessoaController = require('../recursos/pessoa.controller');

//Usuário
let usuarioController = require('../recursos/usuario.controller');

//Porteiro
let porteiroController = require('../recursos/porteiro.controller');

//Visita
let visitaController = require('../recursos/visita.controller');

//Condomino
let condominoController = require('../recursos/condomino.controller');

//Condomino
let convidadoController = require('../recursos/condomino_convidado.controller');

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

//Visita
rota.get('/visita', visitaController.carregaTudo);
rota.get('/visita/:id', visitaController.carregaPorId);
rota.post('/visita', visitaController.salva);
rota.delete('/visita/:id', visitaController.exclui);
rota.put('/visita/:id', visitaController.atualiza);
rota.put('/visita/:id/pessoa', visitaController.atualizaPessoa);
rota.put('/visita/:id/situacao', visitaController.atualizaSituacao);
rota.put('/visita/:id/portaria', visitaController.atualizaPortaria);

//Condomino
rota.get('/condomino', condominoController.carregaTudo);
rota.get('/condomino/:id', condominoController.carregaPorId);
rota.post('/condomino', condominoController.salva);
rota.delete('/condomino/:id', condominoController.exclui);
rota.put('/condomino/:id', condominoController.atualiza);

//Convidado
rota.get('/convidado', convidadoController.carregaTudo);
rota.get('/convidado/:id', convidadoController.carregaPorId);
rota.put('/convidado/:id', convidadoController.atualiza);
rota.post('/convidado', convidadoController.salva);
rota.delete('/convidado/:id', convidadoController.exclui);

//Torna todas as rotas públicas
module.exports = rota;