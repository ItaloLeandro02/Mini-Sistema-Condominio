var router = angular.module('materialApp.routes', ['ui.router']);
router.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

    $urlRouterProvider.otherwise('/home');

    // UI Router States
    // Inserting Page title as State Param
    $stateProvider

        .state('app', {
            url: '/app',
            template:  '<ion-nav-view></ion-nav-view>',
            abstract: false,
            resolve : {
               // resolvedUser : checkForAuthenticatedUser 
            }
        })
        .state('app.home', {
            url: '/home',
            templateUrl: 'home.html',
            controlador :  'homeCtrl', 
            params: {
                title: "Material Starter"
            },
            resolve: {
                CurrentUser: function(resolvedUser){
                    return resolvedUser;
                },
                getCurrentUser: function () {
                    if (CurrentUser) {
                        return $q.when(CurrentUser);
                    } else {
                        return $q.reject("NO USER");
                    }
                },
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