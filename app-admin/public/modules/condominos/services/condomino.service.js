angular.module('app.condomino')
.factory('condominoService', function(api) {
    
    var condominoFactory = {};

    condominoFactory.getAll = function() {       
        var ds = new api.condomino();
            return ds.$get()
    };

    condominoFactory.getById =function(condominoId) {
        var ds      = new api.condomino();
            ds.id   = condominoId;
                return ds.$get();
    }

    condominoFactory.save = function(condominoModel) {
        var ds                          = new api.condomino();
            ds.pessoa                   = condominoModel.pessoa;
            ds.usuario                  = condominoModel.usuario;
            ds.endereco                 = condominoModel.endereco; 
            ds.id                       = condominoModel.id;
            
                if (ds.id) {
                    return ds.$update();
                }
                    return ds.$save();
    }

    condominoFactory.delete= function(condomino) {
        var ds      = new api.condomino();
            ds.id   = condomino.id;
                return ds.$delete();
    }

    condominoFactory.getCondomino = function(nomeCondomino) {
        var ds          = new api.condomino;
            return ds.$get({search : nomeCondomino})
    }

    return condominoFactory;
});