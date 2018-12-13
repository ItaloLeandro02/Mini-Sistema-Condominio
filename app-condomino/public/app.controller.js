angular.module('appCtrl', [])
.controller('appCtrl', function($mdSidenav, $stateParams, $rootScope, $localStorage,$state) {

    self = this;

    self.usuarioLogado = $localStorage.usuarioLogado;

    self.updateNome = function() {
        if ($localStorage.usuarioLogado) {
            self.nomeUsuario = $localStorage.usuarioLogado.condomino.pessoa.nome;
        }
    }

    $rootScope.$on('$stateChangeSuccess', self.updateNome);

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
