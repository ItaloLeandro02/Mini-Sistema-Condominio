/*
O propósito de "use strict" é indicar que o código deve ser executado em "modo estrito".
Com o modo estrito, você não pode, por exemplo, usar variáveis ​​não declaradas.
*/
'use strict';

//Sequelize = ORM banco relacional
//Modelos são definidos com sequelize.define('name', {attributes}, {options}).
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Endereco', {
        id: {
            type: DataTypes.INTEGER,
            field: 'id',
            allowNull: true,
            primaryKey: true,
            autoIncrement: true,
            comment: 'Chave primaria'
        },     
        logradouro: {
            type: DataTypes.STRING(120),
            field: 'logradouro',
            allowNull: true,
            comment: 'Logradouro onde a pessoa reside'
        },
        numero: {
            type: DataTypes.INTEGER,
            field: 'numero',
            allowNull: true,
            comment: 'Número onde a pessoa reside'
        },
        bairro: {
            type: DataTypes.STRING(50),
            field: 'bairro',
            allowNull: true,
            comment: 'Bairro onde a pessoa reside'
        },
        cidade: {
            type: DataTypes.STRING(50),
            field: 'cidade',
            allowNull: true,
            comment: 'Cidade onde a pessoa reside'
        },
        uf: {
            type: DataTypes.CHAR(2),
            field: 'uf',
            allowNull: true,
            comment: 'UF onde a pessoa reside'
        },

    }, {
        //schema: 'public',
        tableName: 'endereco',
        timestamps: false,
        name:{
            singular:'endereco',
            plural  :'enderecos'
        }
    });
};

module.exports.initRelations = function() {
    delete module.exports.initRelations;
};
