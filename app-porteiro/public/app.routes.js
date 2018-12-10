var router = angular.module('materialApp.routes', ['ui.router']);
router.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

    $urlRouterProvider.otherwise('/home');

    // UI Router States
    // Inserting Page title as State Param
    $stateProvider

        .state('home', {
            url: '/home',
            templateUrl: 'home.html',
            params: {
                title: "Material Starter"
            }
        })
        
        .state('login', {
            url: '/login',
            templateUrl: '/modules/visitas/views/index.html',
            controller: 'VisitaListaController',
            controllerAs: 'vm',
            
        });

    $locationProvider.html5Mode(true);

});