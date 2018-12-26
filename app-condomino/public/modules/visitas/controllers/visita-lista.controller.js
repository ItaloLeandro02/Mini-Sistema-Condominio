angular.module('app.visita')
.controller('VisitaListaController', visitaListaController);

function visitaListaController(visitaService, $state, $localStorage, $mdDialog) {
	
	vm = this;

	vm.novaVisita 			= novaVisita;
	vm.editar 				= editar;
	vm.cancelar 			= cancelar;
	vm.filtraVisita		 	= fnFiltraVisita;
	vm.carregaConvidados 	= carregaConvidados;

	vm.topDirections 		= ['left', 'up'];
	vm.bottomDirections 	= ['down', 'right'];

	vm.isOpen 				= false;

	vm.availableModes 		= ['md-fling', 'md-scale'];
	vm.selectedMode 		= 'md-scale';

	vm.availableDirections 	= ['up', 'down', 'left', 'right'];
	vm.selectedDirection 	= 'left';


	function init(){
		if ($localStorage.usuarioLogado) {
			carregaVisitas()
		}
	}

	init()

	function carregaVisitas(){	
		visitaService.getAll($localStorage.usuarioLogado.condomino.id).then(function(visitas){
			vm.dataset = visitas.data.map(function(resp){
                if (new Date() >= new Date(resp.data_Hora_Reserva) && resp.situacao == 1){
					var visitaUpdate = {
						situacao : 3
					}
					visitaUpdate.id = resp.id;
					visitaService.updateVisitaSituacao(visitaUpdate);
                    resp.situacao = "Expirada";
                } 

                switch (resp.situacao) {
                    case 1:
						resp.situacao = "Agendada"
                        break;
                    case 2:
						resp.situacao = "Liberada"
                        break;    
                    case 3:
                        resp.situacao = "Expirada"
                        break;
                    case 4:
                        resp.situacao = "Cancelada"
                        break;
                    case 5:
						resp.situacao = "Negada"
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
				.textContent('Confirma o cancelamento da visita ' + visita.nomeConvidado + '?')
				.ariaLabel('Msg interna do botao')
				.targetEvent(ev)
				.ok('Sim')
				.cancel('Não');
	    			$mdDialog.show(confirmacao).then(function() {
						if (dadosVisita.situacao != "Agendada") {
							toastr.error("Visita não pode ser cancelada.","ERRO")
								return
						}

						var visitaModel = {
							situacao : 4
						}

						visitaModel.id = dadosVisita.id;

						visitaService.updateVisitaSituacao(visitaModel)

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

	function fnFiltraVisita(filtro) {
		vm.situacao = filtro
	}

	function carregaConvidados(nomeConvidado) {
        return visitaService.getConvidados($localStorage.usuarioLogado.condomino.id, nomeConvidado).then(function(convidadosModel){
            vm.dataset = convidadosModel.data;
                return convidadosModel.data
        })
    }
}