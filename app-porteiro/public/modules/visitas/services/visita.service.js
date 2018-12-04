angular.module('app.visita')
.factory('visitaService', function(api) {
    
    var visitaFactory = {};

    visitaFactory.getAll = function() {       
        
        /// Modelo de consumo da api
        var ds = new api.visita();
        return ds.$get()
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

    visitaFactory.cancela = function(visitaModel) {
        var ds      = new api.visita();
        ds.id       = visitaModel.id;
        ds.visita   = visitaModel;
        return ds.$update();
    }

    visitaFactory.getVisita = function(nomeCondomino) {       
        var ds = new api.visita();
        return ds.$get({condominoVisitas : nomeCondomino})
    };

    //Estou trabalhando neste
    visitaFactory.getCondomino = function(nomeCondomino) {
        var ds = new api.condomino();
        return ds.$get({search : nomeCondomino});
    }

    visitaFactory.favorita = function(convidadoModel) {
        var ds         = new api.convidado();
        ds.id          = convidadoModel.id,
        ds.convidado   = convidadoModel
        return ds.$update();
    }


    return visitaFactory;

});