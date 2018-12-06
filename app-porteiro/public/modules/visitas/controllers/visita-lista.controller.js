angular.module('app.visita')
.controller('VisitaListaController', visitaListaController);

function visitaListaController(visitaService, $state, $stateParams, $localStorage, $mdDialog) {
	
	vm = this;

	vm.carregaCondomino		= carregaCondomino;
	vm.pesquisaVisita		= pesquisaVisita;
	vm.novoVisitante		= novoVisitante;
	vm.finalizarVisita		= finalizarVisita
	vm.novoConvidado		= novoConvidado;
	vm.visitasLiberadas 	= visitasLiberadas;
	vm.visitasNegadas 		= visitasNegadas
	
	
	vm.topDirections = ['left', 'up'];
	vm.bottomDirections = ['down', 'right'];

	vm.isOpen = false;

	vm.availableModes = ['md-fling', 'md-scale'];
	vm.selectedMode = 'md-scale';

	vm.availableDirections = ['up', 'down', 'left', 'right'];
	vm.selectedDirection = 'rigth';


	vm.situacao = "Agendado"
	vm.desativado = true;
	vm.imagem = "visitas-agendadas.svg"

	function init(){
		carregaVisitas()
	}

	init()

	//Esta função formata a saída para uma leitura do campo situação mais legível, além de alterar a situação para expirada a apartir da hora e data atual
	//Tornando assim, consistente e precisa
	function carregaVisitas(){	
		visitaService.getAll().then(function(visitas){			
			vm.dataset = visitas.data.map(function(resp){
                if (new Date() >= new Date(resp.dataHoraExpiracao) && resp.situacao == 1){
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

	function carregaCondomino(nomeCondomino) {
        return visitaService.getCondomino(nomeCondomino).then(function(condominosModel){
            console.log(condominosModel.data)
            vm.dsCondominos = condominosModel.data;
            return condominosModel.data
        })
    }

	function finalizarVisita(visita) {
		$state.go('finalizar-visita', {visitaId: visita})
	}

	function visitasLiberadas() {
		vm.situacao = "Liberado"
		vm.estado = 2
		vm.imagem 	= "visitas-confirmadas.svg"
	}


	function visitasNegadas() {
		vm.situacao = "Negado"
		vm.imagem 	= "visitas-negadas.svg"
	}
	
	function pesquisaVisita(nomeCondomino) {
		return visitaService.getVisita(nomeCondomino).then(function(visitaModel) {
			visitaService.getVisitasCondomino(visitaModel.data.condominoId).then(function(visitas){			
				vm.dataset = visitas.data.map(function(resp){
					if (new Date() >= new Date(resp.dataHoraExpiracao) && resp.situacao == 1){
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
		})
	}


	function novoVisitante(dadosVisita) {
		console.log(dadosVisita)
		$state.go('novo-visitante', {visitaId: dadosVisita.id})
	}

	function novoConvidado() {
		$state.go('novo-visitante')
	}
}