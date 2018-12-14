/*
O propósito de "use strict" é indicar que o código deve ser executado em "modo estrito".
Com o modo estrito, você não pode, por exemplo, usar variáveis ​​não declaradas.
*/
'use strict';

//Sequelize = ORM banco relacional
//Modelos são definidos com sequelize.define('name', {attributes}, {options}).
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Condomino_Convidado', {
        id: {
            type: DataTypes.INTEGER,
            field: 'id',
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            comment: 'Chave primaria'
        },        
        condominoId: {
            type: DataTypes.INTEGER,
            field: 'condomino_id',
            allowNull: false,
            comment: 'Chave estrangeira Condomino',
            
        },
        pessoaId: {
            type: DataTypes.INTEGER,
            field: 'pessoa_id',
            allowNull: false,
            comment: 'Chave estrangeira Pessoa'
        },
        favorito: {
            type: DataTypes.BOOLEAN,
            field: 'favorito',
            allowNull: false,
            comment: 'Define se o convidado é um favorito'
        }
    }, {
        //schema: 'public',
        tableName: 'condomino_convidado',
        timestamps: false,
        name:{
            singular:'condomino_convidado',
            plural  :'condomino_convidados'
        }
    });
};

module.exports.initRelations = function() {
    delete module.exports.initRelations;
    
    var dataContext              = require('../dao');
    var Condomino_Convidado      = dataContext.Condomino_Convidado;
    var Condomino                = dataContext.Condomino;
    var Pessoa                   = dataContext.Pessoa;    

    Condomino_Convidado.belongsTo(Pessoa, {
        foreignKey: 'pessoa_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });

    Condomino_Convidado.belongsTo(Condomino, {
        foreignKey: 'condomino_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
};
