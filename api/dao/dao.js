/*
O propósito de "use strict" é indicar que o código deve ser executado em "modo estrito".
Com o modo estrito, você não pode, por exemplo, usar variáveis ​​não declaradas.
*/
'use strict';

var pg = require('pg');

/// Conexao do sequelize
let Sequelize   = require('sequelize'),
    conexao     = new Sequelize('aula', 'postgres', '123456789',
    {
        host: '127.0.0.1',
        port:5432,
        dialect: 'postgres',
        logging: false,
        isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED        
    });


// Configurações para o POSTGRES
var types = {
    FLOAT4: 700,
    FLOAT8: 701,
    NUMERIC: 1700,
    FLOAT4_ARRAY: 1021,
    FLOAT8_ARRAY: 1022,
    NUMERIC_ARRAY: 1231
},

formataFloat = function fnFormataFloat(valor) {
    if(/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/.test(valor))
        return Number(valor);
    return 0;
}

pg.types.setTypeParser(types.FLOAT4, 'text', formataFloat);
pg.types.setTypeParser(types.FLOAT8, 'text', formataFloat);
pg.types.setTypeParser(types.NUMERIC, 'text', formataFloat);




/// Instancias dos modelos
var model = {};
var initialized = false;


function init() {
    delete module.exports.init;     
    initialized = true;
    
    
	// Modelos
    model.Pessoa = conexao.import('./modelo/pessoa.js');
    model.Venda  = conexao.import('./modelo/venda.js');
    
    // Arquivos
    require('./modelo/pessoa.js').initRelations();
    require('./modelo/venda.js').initRelations();    

    return model;
}

model.Sequelize = Sequelize;
model.conexao   = conexao;

module.exports = model;
module.exports.init = init;
module.exports.isInitialized = initialized;