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
            allowNull: true,
            comment: 'Id do Condomino',
            
        },
        pessoaId: {
            type: DataTypes.INTEGER,
            field: 'pessoa_id',
            allowNull: true,
            comment: 'Id da pessoa que é um condomino'
        },
        dataHoraReserva: {
            type: DataTypes.DATE,
            field: 'data_hora_reserva',
            allowNull: true,
            comment: 'Data e hora agendados para a chegada do visitante'
        },

        nomeConvidado: {
            type: DataTypes.STRING(80),
            field: 'nome_convidado',
            allowNull: true,
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
            allowNull: true,
            comment: 'Horario limite para que o convidado chegue'
        },
      
        situacao: {
            type: DataTypes.INTEGER,
            field: 'situacao',
            allowNull: true,
            comment: 'Situacao da visita 1- Agendado, 2- Liberado, 3- Expirado, 4-Cancelado, 5- Negado'
        },
        portariaDataHoraChegada: {
            type: DataTypes.DATE,
            field: 'portaria_data_hora_chegada',
            allowNull: true,
            comment: 'Data e hoario em que o visitante chegou'
        },
        porteiroId: {
            type: DataTypes.INTEGER,
            field: 'porteiro_id',
            allowNull: true,
            comment: 'Id do porteiro'
        },
        portariaObservacao: {
            type: DataTypes.STRING(80),
            field: 'portaria_observacao',
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
    
    var dataContext  = require('../dao');
    var Visita       = dataContext.Visita;
    var Porteiro     = dataContext.Porteiro;
    var Pessoa       = dataContext.Pessoa;
    var Condomino    = dataContext.Condomino;    

    Visita.belongsTo(Pessoa, {
        foreignKey: 'pessoa_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });

    Visita.belongsTo(Porteiro, {
        foreignKey: 'porteiro_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });

    Visita.belongsTo(Condomino, {
        foreignKey: 'condomino_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
};

