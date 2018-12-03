(function ()
{
  'use strict';

  angular
    angular.module('app.porteiro', [])
    .config(config);
  
  function config($stateProvider)
  {
    // State
    $stateProvider
      
    .state('porteiro', {
        url: '/porteiros',
        templateUrl: '/modules/porteiros/views/porteiro-lista.html',
        controller: 'PorteiroListaController',
        controllerAs: 'vm',
        params: {
            title: "Porteiros Cadastrados"
        }
    })
    .state('novo-porteiro', {
        url: '/porteiros/novo-porteiro',
        templateUrl: '/modules/porteiros/views/porteiro-novo.html',
        controller: 'PorteiroController',
        controllerAs: 'vm',
        params: {
            title: "Novo Porteiro"
        },
        resolve : {
            porteiroId : function($stateParams){
                console.log('Modulo: ' + $stateParams.id)
                return $stateParams.id;
            }    
        }
    })

    .state('editar-porteiro', {
        url: '/porteiros/editar-porteiro/:id',
        templateUrl: '/modules/porteiros/views/porteiro-edita.html',
        controller: 'PorteiroController',
        controllerAs: 'vm',
        params: {
            title: "Editar Porteiro"
        },
        resolve : {
            porteiroId : function($stateParams){
                console.log('Modulo: ' + $stateParams.id)
                return $stateParams.id;
            }    
        }
    })
  }
})()