(function ()
{
  'use strict';

  angular
    angular.module('app.login', [])
    .config(config);
  
  function config($stateProvider)
  {
    // State
    $stateProvider
      
    .state('login', {
        url: '/login',
        controller: 'LoginController',
        controllerAs: 'vm',
        params: {
            title: "Entre Com os Dados"
        },
        views : {
          'login' : {
           templateUrl: '/modules/login/views/index.html',
           controller: 'LoginController',
           controllerAs: 'vm',
          }
       }
    })
    
  }
})()