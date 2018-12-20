angular.module('app.porteiro')
.factory('porteiroService', function(api) {
    
    var porteiroFactory = {};

    porteiroFactory.getAll = function() {       
        
        /// Modelo de consumo da api
        var ds = new api.porteiro();
        return ds.$get()
    };

    porteiroFactory.getById =function(porteiroId) {
        var ds      = new api.porteiro();
            ds.id   = porteiroId;
            return ds.$get();
    }

    porteiroFactory.save = function(porteiroModel) {
        var ds                  = new api.porteiro();
        ds.pessoa               = porteiroModel.pessoa;
        ds.pessoa.endereco      = porteiroModel.endereco;
        ds.usuario              = porteiroModel.usuario;
        ds.id                   = porteiroModel.id;
        
          if (ds.id) {
            return ds.$update();
          }
            return ds.$save();
    }

    porteiroFactory.delete= function(porteiro) {
        var ds      = new api.porteiro();
            ds.id   = porteiro.id;
            return ds.$delete();
    }

    porteiroFactory.getPorteiro = function(porteiroModel) {
        var ds          = new api.porteiro;
            return ds.$get({nomePorteiro: porteiroModel})
    }

    return porteiroFactory;
});