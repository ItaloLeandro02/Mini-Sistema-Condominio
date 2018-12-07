var materialApp = angular
.module('materialApp', [
    'materialApp.routes',
    'ui.router',
    'ngMaterial',
    'ngResource',
    'appCtrl',
    'ngStorage',
    'app.visita',
    'app.porteiro',
    'ui.utils.masks',
    'ngMessages' 
    

]).config(
    
    function($mdThemingProvider,$mdDateLocaleProvider,$mdAriaProvider) {
  
    $mdThemingProvider.theme('default')
    .primaryPalette('indigo')
    .accentPalette('red');

    // Formata de data brasileiro
    $mdDateLocaleProvider.formatDate = function(date) {
        return date ? moment(date).format('DD/MM/YYYY') : null;
    };

    // Desativar os warnings de ARIA-LABEL (label para tecnologias assistivas)
    $mdAriaProvider.disableWarnings();

},
//Função para verificar se o usuário está logado
function CheckForAuthenticatedUser(ParseService, $state) {
    return ParseService.getCurrentUser().then(function (_user) {
        // if resolved successfully return a user object that will set
        // the variable `resolvedUser`
        return _user;
    }, function (_error) {
        $state.go('login');
    })
}
);