/*
O propósito de "use strict" é indicar que o código deve ser executado em "modo estrito".
Com o modo estrito, você não pode, por exemplo, usar variáveis ​​não declaradas.
*/
'use strict';

//Sequelize = ORM banco relacional
//Modelos são definidos com sequelize.define('name', {attributes}, {options}).
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Porteiro', {
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
        }
    }, {
        //schema: 'public',
        tableName: 'porteiro',
        timestamps: false,
        name:{
            singular:'porteiro',
            plural  :'porteiros'
        }
    });
};

module.exports.initRelations = function() {
    delete module.exports.initRelations;
    
    var dataContext = require('../dao');
    var Porteiro    = dataContext.Porteiro;
    var Pessoa      = dataContext.Pessoa;
    var Usuario     = dataContext.Usuario;    

    Porteiro.belongsTo(Pessoa, {
        foreignKey: 'pessoa_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });

    Porteiro.belongsTo(Usuario, {
        foreignKey: 'usuario_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
};
