/*
O propósito de "use strict" é indicar que o código deve ser executado em "modo estrito".
Com o modo estrito, você não pode, por exemplo, usar variáveis ​​não declaradas.
*/
'use strict';

//Sequelize = ORM banco relacional
//Modelos são definidos com sequelize.define('name', {attributes}, {options}).
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('porteiro', {
        id: {
            type: DataTypes.INTEGER,
            field: 'id',
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            comment: 'Chave primaria'
        },        
        usuario_id: {
            type: DataTypes.INTEGER,
            field: 'usuario_id',
            allowNull: false,
            comment: 'Chave estrangeira Usuario',
            
        },
        pessoa_id: {
            type: DataTypes.INTEGER,
            field: 'pessoa_id',
            allowNull: false,
            comment: 'Chave estrangeira Pessoa'
        }
    }, {
        schema: 'public',
        tableName: 'porteiro',
        timestamps: true,
        name:{
            singular:'porteiro',
            plural  :'porteiros'
        }
    });
};

module.exports.initRelations = function() {
    delete module.exports.initRelations; 
};
