/*
O propósito de "use strict" é indicar que o código deve ser executado em "modo estrito".
Com o modo estrito, você não pode, por exemplo, usar variáveis ​​não declaradas.
*/
'use strict';

//Sequelize = ORM banco relacional
//Modelos são definidos com sequelize.define('name', {attributes}, {options}).
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Condomino', {
        id: {
            type: DataTypes.INTEGER,
            field: 'id',
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            comment: 'Chave primaria'
        },        
        usuarioId: {
            type: DataTypes.INTEGER,
            field: 'usuario_id',
            allowNull: false,
            comment: 'Chave estrangeira Usuario',
            
        },
        pessoaId: {
            type: DataTypes.INTEGER,
            field: 'pessoa_id',
            allowNull: false,
            comment: 'Chave estrangeira Pessoa'
        },
        enderecoCondomino: {
            type: DataTypes.STRING(80),
            field: 'endereco',
            allowNull: false,
            comment: 'Endereco, ex. apt 101, quadra 15, etc'
        }

    }, {
        //schema: 'public',
        tableName: 'condomino',
        timestamps: false,
        name:{
            singular:'condomino',
            plural  :'condominos'
        }
    });
};

//Exporta a classe para o projeto
//Quando utilizar o require só ira utilizar o que for exportado
//Torna públic
module.exports.initRelations = function() {
    delete module.exports.initRelations; 

    var dataContext     = require('../dao');
    var Condomino       = dataContext.Condomino;
    var Pessoa          = dataContext.Pessoa;
    var Usuario         = dataContext.Usuario;    

    Condomino.belongsTo(Pessoa, {
        foreignKey: 'pessoa_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });

    Condomino.belongsTo(Usuario, {
        foreignKey: 'usuario_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });

    /*PctUsuario.belongsToMany(EvoCliente, {
        through: EvoClienteUsuario,
        foreignKey: 'pct_usuario_id',
        otherKey: 'evo_cliente_id',
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION'
    });*/

    /*PctUsuario.hasMany(PctUsuarioPermissao, {
        foreignKey: 'pct_usuario_id',
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION'
    });*/ 
};

