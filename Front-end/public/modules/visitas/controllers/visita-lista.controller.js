angular.module('app.visita')
.controller('VisitaListaController', visitaListaController);

function visitaListaController(visitaService, $state, $stateParams) {
	
	vm = this;

	vm.novaVisita 	= novaVisita;
	vm.editar 		= editar;

	function init(){
		carregaVisitas()
	}

	init()

	function carregaVisitas(){
		visitaService.getAll(1015).then(function(visitas){			
			vm.dataset = visitas.data
		})
	}

	function novaVisita() {
		$state.go('nova-visita');	
	}

	function editar(visitaId) {
		$state.go('editar-visita', {id : visitaId})		
	}
}