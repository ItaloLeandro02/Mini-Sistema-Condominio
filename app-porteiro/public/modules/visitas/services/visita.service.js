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

    visitaFactory.save = function(pessoaModel){
        var ds      = new api.pessoa();
        ds.pessoa   = pessoaModel;
        return ds.$save().then(function(visitanteModel) {
            console.log(visitanteModel)
            return visitanteModel;
        })        
    }
    
    visitaFactory.getVisita = function(nomeCondomino) {       
        var ds = new api.visita();
        return ds.$get({condominoVisitas : nomeCondomino})
    };

    visitaFactory.getCondomino = function(nomeCondomino) {
        var ds = new api.condomino();
        return ds.$get({search : nomeCondomino});
    }
     
    visitaFactory.saveVisitante = function(convidadoModel) {
        var ds               = new api.convidado();
        ds.convidado         = convidadoModel;
        return ds.$save();
    }

    visitaFactory.updateVisita = function(visitaModel) {
        var ds      = new api.atualizaVisitaPessoa();
        ds.id       = visitaModel.id;
        ds.visita   = visitaModel;
        return ds.$update();
    }

    visitaFactory.updateVisitaPortaria = function(visitaModel) {
        var ds      = new api.atualizaVisitaPortaria();
        ds.id       = visitaModel.id;
        ds.visita   = visitaModel;
        return ds.$update();
    }

    visitaFactory.updateVisitaSituacao = function(visitaModel) {
        var ds      = new api.atualizaVisitaSituacao();
        ds.id       = visitaModel.id;
        ds.visita   = visitaModel;
        return ds.$update();
    }

    visitaFactory.getVisitasCondomino = function(condominoId) {
        /// Modelo de consumo da api
        var ds = new api.visita();
        return ds.$get({condomino : condominoId});
    }

    visitaFactory.login = function(email, senha) {
        var ds  = new api.convidado();
    }
    
    return visitaFactory;

});