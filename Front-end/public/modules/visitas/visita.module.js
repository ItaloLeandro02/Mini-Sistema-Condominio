(function ()
{
  'use strict';

  angular
    angular.module('app.visita', [])
    .config(config);
  
  function config($stateProvider)
  {
    // State
    $stateProvider
      
    .state('visita', {
        url: '/visitas',
        templateUrl: '/modules/visitas/views/visita-lista.html',
        controller: 'VisitaListaController',
        controllerAs: 'vm',
        params: {
            title: "Visitas agendadas"
        }
    })

    .state('nova-visita', {
        url: '/visitas/nova-visita',
        templateUrl: '/modules/visitas/views/visita-nova.html',
        controller: 'VisitaListaController',
        controllerAs: 'vm',
        params: {
            title: "Novo Agendamento"
        }
    })

    .state('editar-visita', {
        url: '/visitas/editar-visita/:id',
        templateUrl: '/modules/visitas/views/visita-edita.html',
        controller: 'VisitaController',
        controllerAs: 'vm',
        params: {
            title: "Editar Visita"
        },
        resolve : {
            visitaId : function($stateParams){
                console.log('Modulo: ' + $stateParams.id)
                return $stateParams.id;
            }    
        }
    })
  }
})()