/*
O propósito de "use strict" é indicar que o código deve ser executado em "modo estrito".
Com o modo estrito, você não pode, por exemplo, usar variáveis ​​não declaradas.
*/
'use strict';

//Sequelize = ORM banco relacional
//Modelos são definidos com sequelize.define('name', {attributes}, {options}).
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Usuario', {
        id: {
            type: DataTypes.INTEGER,
            field: 'id',
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            comment: 'Chave primaria'
        },
        email: {
            type: DataTypes.STRING(80),
            field: 'email',
            allowNull: false,
            comment: 'Email do usuario'
        },        
        tipo: {
            type: DataTypes.INTEGER,
            field: 'tipo',
            allowNull: false,
            comment: 'Tipo de usuario 1- Portaria, 2- Condomino, 3- Administrador'
        },
        senha: {
            type: DataTypes.STRING(32),
            field: 'senha',
            allowNull: false,
            comment: 'Senha para o login'
        },
        desativado: {
            type: DataTypes.BOOLEAN,
            field: 'desativado',
            allowNull: false,
            comment: 'Status do usuario'
        },
        criacao: {
            type: DataTypes.DATE,
            field: 'criacao',
            allowNull: false,
            comment: 'Data e hora da criacao'
        },
        token: {
            type: DataTypes.STRING,
            field: 'token',
            allowNull: true,
            comment: 'Token para validação'
        }
        
    }, {
        //schema: 'public',
        tableName: 'usuario',
        timestamps: false,
        name:{
            singular:'usuario',
            plural  :'usuarios'
        }
    });
};

module.exports.initRelations = function() {
    delete module.exports.initRelations; 
};

