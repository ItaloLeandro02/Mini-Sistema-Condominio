angular.module('app.visita')
.controller('VisitaListaController', visitaListaController);

function visitaListaController(visitaService, $state, $stateParams, $localStorage, $mdDialog) {
	
	vm = this;

	vm.novaVisita 	= novaVisita;
	vm.editar 		= editar;
	vm.cancelar 	= cancelar;

	vm.topDirections = ['left', 'up'];
	vm.bottomDirections = ['down', 'right'];

	vm.isOpen = false;

	vm.availableModes = ['md-fling', 'md-scale'];
	vm.selectedMode = 'md-scale';

	vm.availableDirections = ['up', 'down', 'left', 'right'];
	vm.selectedDirection = 'rigth';

	function init(){
		carregaVisitas()
	}

	init()

	/*
	function carregaVisitas(){
		visitaService.getAll($localStorage.condomino.id).then(function(visitas){			
			vm.dataset = visitas.data
		})
	}
	*/

	function carregaVisitas(){	
		visitaService.getAll($localStorage.condomino.id).then(function(visitas){			
			vm.dataset = visitas.data.map(function(resp){
                if ((new Date() >= new Date(resp.dataHoraExpiracao)) && (resp.situacao == 1)){
                    resp.situacao = "Expirado";
                } 

                switch (resp.situacao) {
                    case 1:
                        resp.situacao = "Agendado"
                        break;
                    case 2:
                        resp.situacao = "Liberado"
                        break;    
                    case 3:
                        resp.situacao = "Expirado"
                        break;
                    case 4:
                        resp.situacao = "Cancelado"
                        break;
                    case 5:
                        resp.situacao = "Negado"
                        break;                
                    default:
                        break;
				}
				
				return resp
            })			
			
		})
	}

	function novaVisita() {
		$state.go('nova-visita');	
	}

	function editar(visitaId) {
		$state.go('editar-visita', {id : visitaId})		
	}

	let dadosVisita;

	function cancelar(ev, visita) {
		dadosVisita = visita;
		let confirmacao = $mdDialog.confirm()
	        .title('A	guardando confirmação')
			.textContent('Confirma o cancelamento da visita ' + visita.nomeConvidado + ' as ' + visita.dataHoraReserva + '?')
	        .ariaLabel('Msg interna do botao')
	        .targetEvent(ev)
	        .ok('Sim')
	        .cancel('Não');
	    		$mdDialog.show(confirmacao).then(function() {
					if (dadosVisita.situacao == 4) {
						toastr.error("Visita já cancelada.","ERRO")
						return
					}
					dadosVisita.situacao = 4;
					visitaService.cancela(dadosVisita)
					.then(function(resposta){
						if (resposta.sucesso) {				
							toastr.success("Visita cancelada com êxito :)","SUCESSO")
						   		$state.go('visita')
					   }
				   })
				   .catch(function(error){
					   console.log(error)
					   toastr.error("Tente novamente.","ERRO")
				   })
	    		});
	}
}