angular.module('app.login')
.factory('loginService', function(api) {
    
    var loginFactory = {};

    loginFactory.signUp = function(email,senha) {
        
        var ds = new api.autenticacao();
        ds.email = email;
        ds.senha = senha;
        return ds.$save()

    }    

    return loginFactory;

});