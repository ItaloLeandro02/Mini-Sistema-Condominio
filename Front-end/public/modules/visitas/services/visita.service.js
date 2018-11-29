angular.module('app.visita')
.factory('visitaService', function(api) {
    
    var visitaFactory = {};

    visitaFactory.getAll = function(condominoId) {       
        
        /// Modelo de consumo da api
        var ds = new api.visita();
        return ds.$get({condomino : condominoId})
    };

    visitaFactory.getById = function(visitaId) {
        
        var ds = new api.visita();
        ds.id = visitaId;
        return ds.$get()
    }

    visitaFactory.save = function(visitaModel){
        var ds = new api.visita();
        ds.visita = visitaModel;
        return ds.$save();        
    }

    visitaFactory.getConvidados = function(condominoId) {       
        
        var ds = new api.convidado();
        return ds.$get({condomino : condominoId})
    };



    return visitaFactory;

});