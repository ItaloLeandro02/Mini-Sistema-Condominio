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

    .state('novo-visitante', {
        url: '/visitas/novo-visitante:dadosConvidados',
        templateUrl: '/modules/visitas/views/visitante-novo.html',
        controller: 'VisitaController',
        controllerAs: 'vm',
        params: {
            title: "Novo Visitante",
        },
        resolve : {
            dadosVisitante : function($stateParams){
                console.log($stateParams)
                return $stateParams.dadosConvidados;
            }    
        }
    })
  }
})()