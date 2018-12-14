angular.module('appCtrl', [])
.controller('appCtrl', function($mdSidenav, $stateParams, $rootScope, $localStorage, $state, $mdDialog) {

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

    self.encerar = function() {
        $localStorage.usuarioLogado = null;
        self.nomeUsuario = null
        toastr.info("Até mais! :P")
        $state.go('login')
    }

    self.logout = function (ev) {
			let confirmacao = $mdDialog.confirm()
				.title('Aguardando confirmação')
				.textContent('Deseja encerrar a aplicação?')
				.ariaLabel('Msg interna do botao')
				.targetEvent(ev)
				.ok('Sim')
				.cancel('Não');
	    			$mdDialog.show(confirmacao).then(function() {
						self.encerar()
	    			});
	}
})
