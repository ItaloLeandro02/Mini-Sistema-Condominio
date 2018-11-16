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
        },
        endereco: {
            type: DataTypes.STRING(80),
            field: 'endereco',
            allowNull: false,
            comment: 'Endereco do Condomino'
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


};

