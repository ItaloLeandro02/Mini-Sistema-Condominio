angular.module('app.login')
.factory('loginService', function(api) {
    
    var loginFactory = {};

    loginFactory.signUp = function(email,senha) {
        
        var ds = new api.autenticacao();
        ds.email = email;
        ds.senha = senha;
        ds.tipo  = 3;
        return ds.$save()

    }    

    return loginFactory;

});