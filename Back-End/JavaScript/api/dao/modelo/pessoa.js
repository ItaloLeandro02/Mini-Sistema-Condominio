/*
O propósito de "use strict" é indicar que o código deve ser executado em "modo estrito".
Com o modo estrito, você não pode, por exemplo, usar variáveis ​​não declaradas.
*/
'use strict';

//Sequelize = ORM banco relacional
//Modelos são definidos com sequelize.define('name', {attributes}, {options}).
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Pessoa', {
        id: {
            type: DataTypes.INTEGER,
            field: 'id',
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            comment: 'Chave primaria'
        },        
        nome: {
            type: DataTypes.STRING(60),
            field: 'nome',
            allowNull: false,
            comment: 'Nome da pessoa',
            
        },
        cpf: {
            type: DataTypes.BIGINT,
            field: 'cpf',
            allowNull: false,
            comment: 'CPF da sem os caracteres Pessoa'
        },
        nascimento: {
            type: DataTypes.DATE,
            field: 'nascimento',
            allowNull: false,
            comment: 'Data de nascimento'
        },
        digital: {
            type: DataTypes.STRING(5),
            field: 'digital',
            allowNull: false,
            comment: 'Senha de 5 caracteres para permitir a entrada'
        },
        enderecoId: {
            type: DataTypes.INTEGER,
            field: 'endereco_id',
            allowNull: false,
            comment: 'Chave estrangeira Endereço',
        },
        /*
        enderecoLogradouro: {
            type: DataTypes.STRING(120),
            field: 'endereco_logradouro',
            allowNull: false,
            comment: 'Logradouro onde a pessoa reside'
        },
        enderecoNumero: {
            type: DataTypes.STRING(3),
            field: 'endereco_numero',
            allowNull: false,
            comment: 'Número onde a pessoa reside'
        },
        enderecoBairro: {
            type: DataTypes.STRING(120),
            field: 'endereco_bairro',
            allowNull: false,
            comment: 'Bairro onde a pessoa reside'
        },
        enderecoCidade: {
            type: DataTypes.STRING(120),
            field: 'endereco_cidade',
            allowNull: false,
            comment: 'Cidade onde a pessoa reside'
        },
        enderecoUf: {
            type: DataTypes.STRING(2),
            field: 'endereco_uf',
            allowNull: false,
            comment: 'UF onde a pessoa reside'
        },*/
        criacao: {
            type: DataTypes.DATE,
            field: 'criacao',
            allowNull: false,
            comment: 'Data e hora da criação da pessoa'
        }

    }, {
        //schema: 'public',
        tableName: 'pessoa',
        timestamps: false,
        name:{
            singular:'pessoa',
            plural  :'pessoas'
        }
    });
};

module.exports.initRelations = function() {
    delete module.exports.initRelations;

    
    var dataContext     = require('../dao');
    var Pessoa          = dataContext.Pessoa;
    var Endereco        = dataContext.Endereco;
 

    Pessoa.belongsTo(Endereco, {
        foreignKey: 'endereco_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
};

