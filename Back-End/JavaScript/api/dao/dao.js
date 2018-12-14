/*
O propósito de "use strict" é indicar que o código deve ser executado em "modo estrito".
Com o modo estrito, você não pode, por exemplo, usar variáveis ​​não declaradas.
*/
'use strict';

var pg = require('pg');

//Importar um módulo sequelize usando require('sequelize'). Assim Sequelize representa uma variável de referência ao Sequelize.e
let Sequelize   = require('sequelize'),
//Criamos uma nova instância do Sequelize usando o seu construtor que possui a seguinte sintaxe:
//new Sequelize(database, [username=null], [password=null], [options={}])
    conexao     = new Sequelize('BD_SistemaCondominio', 'sa', 'IL0604#@',

    {
        host: '127.0.0.1',
        //port:5432,          //A porta do banco de dados relacional.
        dialect: 'mssql',   //O dialeto do banco de dados ao qual você está se conectando. Um dos mysql, postgres, sqlite e mssql.
        logging: false,     //Uma função que registra consultas sql ou false para nenhum log
        isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED    //	Definir o nível de isolamento de transação padrão. Veja Sequelize.Transaction.ISOLATION_LEVELS as opções possíveis.    
    });

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
    model.Pessoa                = conexao.import('./modelo/pessoa.js');
    model.Usuario               = conexao.import('./modelo/usuario.js');
    model.Porteiro              = conexao.import('./modelo/porteiro.js');
    model.Visita                = conexao.import('./modelo/visita.js');
    model.Condomino             = conexao.import('./modelo/condomino.js');
    model.Endereco              = conexao.import('./modelo/endereco.js');
    model.Condomino_Convidado   = conexao.import('./modelo/condomino_convidado.js');
    
    // Arquivos
    require('./modelo/pessoa.js').initRelations();
    require('./modelo/usuario.js').initRelations();    
    require('./modelo/porteiro.js').initRelations(); 
    require('./modelo/visita.js').initRelations();    
    require('./modelo/condomino.js').initRelations(); 
    require('./modelo/endereco.js').initRelations();   
    require('./modelo/condomino_convidado.js').initRelations(); 

    return model;
}

model.Sequelize = Sequelize;
model.conexao   = conexao;

module.exports = model;
module.exports.init = init;
module.exports.isInitialized = initialized;