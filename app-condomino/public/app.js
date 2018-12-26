var materialApp = angular
.module('materialApp', [
    'materialApp.routes',
    'ui.router',
    'ngMaterial',
    'ngResource',
    'appCtrl',
    'ngStorage',
    'app.visita',
    'app.login',
    'ngMessages',      

]).config(
    
  function($mdThemingProvider,$mdDateLocaleProvider,$mdAriaProvider, $httpProvider) {

  $mdThemingProvider.theme('default')
  .primaryPalette('indigo')
  .accentPalette('red');

  // Formata de data brasileiro
  $mdDateLocaleProvider.formatDate = function(date) {
      return date ? moment(date).format('DD/MM/YYYY') : null;
  };

  // Desativar os warnings de ARIA-LABEL (label para tecnologias assistivas)
  $mdAriaProvider.disableWarnings();

  /// Interceptador de requisicoes
  $httpProvider.interceptors.push(function($q, $injector, $localStorage) {
      return {
        'request': function (config) {
          config.headers = config.headers || {};
          if ($localStorage.usuarioLogado) {
            config.headers.Authorization = 'Bearer ' + $localStorage.usuarioLogado.token;
          }

          return config;
        },
        'responseError': function(response) {
          switch (response.status) {
            case 401:
              var stateService = $injector.get('$state');
              stateService.go('login');
              toastr.error("Token Expirado! Entre Novamente. ","ERRO")
              break;                

            default :
              return $q.reject(response);
          }
        }
      };
    })


});