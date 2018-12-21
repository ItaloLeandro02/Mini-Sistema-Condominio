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
        var ds              = new api.pessoa();
        ds.nome             = pessoaModel.nome;
        ds.cpf              = pessoaModel.cpf;
        ds.nascimento       = pessoaModel.nascimento;
        ds.endereco         = pessoaModel.endereco;

            return ds.$save().then(function(visitanteModel) {
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
        var ds            = new api.convidado();
        ds.pessoa_Id      = convidadoModel.pessoa_Id;
        ds.condomino_Id   = convidadoModel.condomino_Id;
        
            return ds.$save();
    }

    visitaFactory.updateVisita = function(visitaModel) {
        var ds                  = new api.atualizaVisitaPessoa();
        ds.nome_Convidado       = visitaModel.nome_Convidado;
        ds.pessoa_Id            = visitaModel.pessoa_Id;
        ds.id                   = visitaModel.id;
    
            return ds.$update();
    }

    visitaFactory.updateVisitaPortaria = function(visitaModel) {
        var ds                          = new api.atualizaVisitaPortaria();
        ds.id                           = visitaModel.id;
        ds.situacao                     = visitaModel.situacao;
        ds.porteiro_Id                  = visitaModel.porteiro_Id;
        ds.portaria_Data_Hora_Chegada   = visitaModel.portaria_Data_Hora_Chegada;
        ds.portaria_Observacao          = visitaModel.portaria_Observacao;
        
            return ds.$update();
    }

    visitaFactory.updateVisitaSituacao = function(visitaModel) {
         var ds         = new api.atualizaVisitaSituacao();
         ds.id          = visitaModel.id;
         ds.situacao    = visitaModel.situacao;
            
            return ds.$update();
    }

    visitaFactory.getVisitasCondomino = function(condominoId) {
        /// Modelo de consumo da api
        var ds = new api.visita();
            return ds.$get({condomino : condominoId});
    }

    visitaFactory.login = function(email, senha) {
        var ds  = new api.usuario();
            return ds.$get({emailLogin : email, senhaLogin : senha})
    }
    
    return visitaFactory;

});