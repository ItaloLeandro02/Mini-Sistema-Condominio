/*
O propósito de "use strict" é indicar que o código deve ser executado em "modo estrito".
Com o modo estrito, você não pode, por exemplo, usar variáveis ​​não declaradas.
*/
'use strict';

//Sequelize = ORM banco relacional
//Modelos são definidos com sequelize.define('name', {attributes}, {options}).
module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Visita', {
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
            comment: 'Id do Condomino',
            
        },
        pessoaId: {
            type: DataTypes.INTEGER,
            field: 'pessoa_id',
            allowNull: false,
            comment: 'Id da pessoa que é um condomino'
        },
        dataHoraReserva: {
            type: DataTypes.DATE,
            field: 'data_hora_reserva',
            allowNull: false,
            comment: 'Data e hora agendados para a chegada do visitante'
        },
        nomeConvidado: {
            type: DataTypes.STRING(80),
            field: 'nome_convidado',
            allowNull: false,
            comment: 'Nome do convidado'
        },
        condominoObservacao: {
            type: DataTypes.STRING(120),
            field: 'condomino_observacao',
            allowNull: true,
            comment: 'Observacao feita pelo condomino'
        },
        dataHoraExpiracao: {
            type: DataTypes.DATE,
            field: 'data_hora_expiracao',
            allowNull: false,
            comment: 'Horario limite para que o convidado chegue'
        },
        situacao: {
            type: DataTypes.INTEGER,
            field: 'situacao',
            allowNull: false,
            comment: 'Situacao da visita'
        },
        portariaDataHoraChegada: {
            type: DataTypes.DATE,
            field: 'portaria_data_hora_chegada',
            allowNull: false,
            comment: 'Data e hoario em que o visitante chegou'
        },
        porteiroId: {
            type: DataTypes.INTEGER,
            field: 'porteiro_id',
            allowNull: false,
            comment: 'Id do porteiro'
        },
        porteiroObservacao: {
            type: DataTypes.STRING(80),
            field: 'porteiro_observacao',
            allowNull: true,
        }

    }, {
        //schema: 'public',
        tableName: 'visita',
        timestamps: false,
        name:{
            singular:'visita',
            plural  :'visitas'
        }
    });
};

module.exports.initRelations = function() {
    delete module.exports.initRelations; 
};

