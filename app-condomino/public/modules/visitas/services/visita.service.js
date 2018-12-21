angular.module('app.visita')
.factory('visitaService', function(api) {
    
    var visitaFactory = {};

    visitaFactory.getAll = function(condominoId) {       
        
        /// Modelo de consumo da api
        var ds = new api.visita();
        return ds.$get({condomino : condominoId})
    };

    visitaFactory.getById = function(visitaId) {
        
        var ds  = new api.visita();
        ds.id   = visitaId;
        return ds.$get()
    }

    visitaFactory.save = function(visitaModel){

        if (visitaModel.id) {
            var ds  = new api.visita();
        }
            else {
                var ds  = new api.Novavisita();
            }
        
                ds.condomino_Id          = visitaModel.condomino_Id;
                ds.condomino_Observacao  = visitaModel.condomino_Observacao;
                ds.data_Hora_Expiracao   = visitaModel.data_Hora_Expiracao;
                ds.data_Hora_Reserva     = visitaModel.data_Hora_Reserva;
                ds.nome_Convidado        = visitaModel.nome_Convidado;
                ds.pessoa_Id             = visitaModel.pessoa_Id;
                ds.id                    = visitaModel.id;

                    if (visitaModel.id) {
                        return ds.$update();
                    }
                        return ds.$save();        
    }

    visitaFactory.getConvidados = function(condominoId, nomeConvidado) {       
        var ds = new api.convidado();
        return ds.$get({condomino : Number(condominoId), convidado : nomeConvidado})
    };

    visitaFactory.getContatos = function(condominoId) {
        var ds = new api.convidado();
        return ds.$get({condomino : condominoId});
    }

    visitaFactory.favorita = function(convidadoModel) {
        var ds         = new api.convidado();
        ds.id          = convidadoModel.id;
        ds.favorito    = convidadoModel.favorito;
            return ds.$update();
    }

    visitaFactory.updateVisitaSituacao = function(visitaModel) {
        var ds          = new api.atualizaVisitaSituacao();
        ds.id           = visitaModel.id;
        ds.situacao     = visitaModel.situacao;
        
            return ds.$update();
    }


    return visitaFactory;

});