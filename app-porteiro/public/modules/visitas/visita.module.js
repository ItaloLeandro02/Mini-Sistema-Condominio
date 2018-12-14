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
        url: '/visitas/novo-visitante/:visitaId',
        templateUrl: '/modules/visitas/views/visitante-novo.html',
        controller: 'VisitaController',
        controllerAs: 'vm',
        params: {
            title: "Novo Visitante"            
        },
        resolve: {
            visitaRecord : function($stateParams,visitaService){
                return visitaService.getById($stateParams.visitaId).then(function(resposta){
                    return resposta.data
                })
            }
        }
    })

    .state('finalizar-visita', {
        url: '/visitas/finalizar-visita/:visitaId',
        templateUrl: '/modules/visitas/views/visita-finalizar.html',
        controller: 'VisitaController',
        controllerAs: 'vm',
        params: {
            title: "Finalizar Visita"
        },
        //Passo como parâmetro o id da visita e retorno o resultado da pesquisa do id no banco de dados
        resolve: {
            visitaRecord : function($stateParams,visitaService){
                return visitaService.getById($stateParams.visitaId).then(function(resposta){
                    return resposta.data
                })
            }
        }
    })

    .state('detalhar-visita', {
        url: '/visitas/detalhar-visita/:visitaId',
        templateUrl: '/modules/visitas/views/visita-detalhar.html',
        controller: 'VisitaController',
        controllerAs: 'vm',
        params: {
            title: "Detalhes da Visitas"
        },
        //Passo como parâmetro o id da visita e retorno o resultado da pesquisa do id no banco de dados
        resolve: {
            visitaRecord : function($stateParams,visitaService){
                return visitaService.getById($stateParams.visitaId).then(function(resposta){
                    return resposta.data
                })
            }
        }
    })
  }
})()