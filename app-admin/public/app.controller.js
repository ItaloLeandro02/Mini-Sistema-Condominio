angular.module('appCtrl', [])
.controller('appCtrl', function($mdSidenav, $stateParams, $rootScope, $localStorage, $state) {

    self = this;


    function init() {

        self.usuarioLogado = $localStorage.usuarioLogado;

        self.updateNome = function() {
            if ($localStorage.usuarioLogado) {
                self.nomeUsuario = $localStorage.usuarioLogado.usuario.email;
            }
        }
    
        $rootScope.$on('$stateChangeSuccess', self.updateNome);
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
        self.nomeUsuario = null
        toastr.info("Até mais! :P")
        $state.go('login')
    }
})
