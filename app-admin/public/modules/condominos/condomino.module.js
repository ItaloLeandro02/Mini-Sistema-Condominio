(function ()
{
  'use strict';

  angular
    angular.module('app.condomino', [])
    .config(config);
  
  function config($stateProvider)
  {
    // State
    $stateProvider
      
    .state('condomino', {
        url: '/condominos',
        templateUrl: '/modules/condominos/views/condomino-lista.html',
        controller: 'CondominoListaController',
        controllerAs: 'vm',
        params: {
            title: "Condôminos Cadastrados",
            nome : null
        }
    })
    .state('novo-condomino', {
        url: '/condominos/novo-condomino',
        templateUrl: '/modules/condominos/views/condomino-novo.html',
        controller: 'CondominoController',
        controllerAs: 'vm',
        params: {
            title: "Novo Condômino",
            nome : null
        },
        resolve : {
            condominoId : function($stateParams){
                console.log('Modulo: ' + $stateParams.id)
                return $stateParams.id;
            }    
        }
    })

    .state('editar-condomino', {
        url: '/condominos/editar-condomino/:id',
        templateUrl: '/modules/condominos/views/condomino-edita.html',
        controller: 'CondominoController',
        controllerAs: 'vm',
        params: {
            title: "Editar Condômino",
            nome : null
        },
        resolve : {
            condominoId : function($stateParams){
                console.log('Modulo: ' + $stateParams.id)
                return $stateParams.id;
            }    
        }
    })
  }
})()