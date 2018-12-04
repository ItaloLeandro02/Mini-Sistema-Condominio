angular.module('app.visita')
.controller('VisitaListaController', visitaListaController);

function visitaListaController(visitaService, $state, $stateParams, $localStorage, $mdDialog) {
	
	vm = this;

	vm.novaVisita 			= novaVisita;
	vm.editar 				= editar;
	vm.cancelar 			= cancelar;
	vm.visitasCanceladas 	= visitasCanceladas;
	vm.visitasLiberadas 	= visitasLiberadas;
	vm.visitasNegadas 		= visitasNegadas;
	vm.listarVisita			= listarVisita;

	vm.topDirections = ['left', 'up'];
	vm.bottomDirections = ['down', 'right'];

	vm.isOpen = false;

	vm.availableModes = ['md-fling', 'md-scale'];
	vm.selectedMode = 'md-scale';

	vm.availableDirections = ['up', 'down', 'left', 'right'];
	vm.selectedDirection = 'rigth';

	vm.situacao = "Agendado";
	vm.imagem = "visitas-agendadas.svg"

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

				if ((new Date() >= new Date(resp.dataHoraExpiracao)) && (resp.situacao == "Agendado")){
					resp.situacao = "Expirado";
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
					if (dadosVisita.situacao != "Agendado") {
						toastr.error("Visita não pode ser cancelada.","ERRO")
						return
					}
					dadosVisita.situacao = 4;
					visitaService.cancela(dadosVisita)
					.then(function(resposta){
						if (resposta.sucesso) {				
							toastr.success("Visita cancelada com êxito :)","SUCESSO")
							carregaVisitas();
					   }
				   })
				   .catch(function(error){
					   console.log(error)
					   toastr.error("Tente novamente.","ERRO")
				   })
	    		});
	}

	function visitasLiberadas() {
		vm.situacao = "Liberado"
		vm.imagem 	= "visitas-confirmadas.svg"
	}

	function visitasCanceladas() {
		vm.situacao = "Cancelado"
		vm.imagem 	= "visitas-canceladas.svg"
	}

	function visitasNegadas() {
		vm.situacao = "Negado"
		vm.imagem 	= "visitas-negadas.svg"
	}

	function listarVisita() {
		vm.situacao = ""
		vm.imagem 	= "visitas-negadas.svg"
	}
}