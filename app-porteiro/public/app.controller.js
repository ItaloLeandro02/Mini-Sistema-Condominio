angular.module('appCtrl', [])
.controller('appCtrl', function($mdSidenav, $stateParams, $rootScope,$localStorage) {  

    self    =  this;


    function init() {
        self.usuarioLogado = $localStorage.usuarioLogado
    }

    init()

    // Update title using rootscope
    self.updateTitle = function() {
        $rootScope.title = $stateParams.title;
    }

    // Run updateTitle on each state change
    $rootScope.$on('$stateChangeSuccess', self.updateTitle);

	self.toggleLeft = function() {
    	$mdSidenav('left').toggle();
    }

    self.toggleRight = function() {
    	$mdSidenav('right').toggle();
    }

    self.logout = function() {
        $localStorage.usuarioLogado = null;
        window.location.reload()
    }

    // Update nome user rootscope
    self.updateName = function() {
        $rootScope.nome = $stateParams.title;
    }
})
