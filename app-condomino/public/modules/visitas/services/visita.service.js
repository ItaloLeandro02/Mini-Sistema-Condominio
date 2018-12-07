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
        var ds      = new api.visita();
        ds.visita   = visitaModel;
        ds.id       = visitaModel.id;
          if (ds.id) {
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
        ds.id          = convidadoModel.id,
        ds.convidado   = convidadoModel
        return ds.$update();
    }

    visitaFactory.updateVisitaSituacao = function(visitaModel) {
        var ds      = new api.atualizaVisitaSituacao();
        ds.id       = visitaModel.id;
        ds.visita   = visitaModel;
        return ds.$update();
    }


    return visitaFactory;

});