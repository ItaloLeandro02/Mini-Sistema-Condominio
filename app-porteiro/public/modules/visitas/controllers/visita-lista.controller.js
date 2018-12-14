angular.module('app.visita')
.controller('VisitaListaController', visitaListaController);

function visitaListaController(visitaService, $state, $localStorage) {
	vm = this;

	vm.carregaCondomino		= carregaCondomino;
	vm.pesquisaVisita		= pesquisaVisita;
	vm.novoVisitante		= novoVisitante;
	vm.finalizarVisita		= finalizarVisita
	vm.novoConvidado		= novoConvidado;
	vm.filtraVisita		 	= fnFiltraVisita;
	vm.detalharVisita		= detalharVisita;
	
	vm.topDirections	 	= ['left', 'up'];
	vm.bottomDirections 	= ['down', 'right'];

	vm.isOpen 				= true;

	vm.availableModes		= ['md-fling', 'md-scale'];
	vm.selectedMode 		= 'md-scale';

	vm.availableDirections 	= ['up', 'down', 'left', 'right'];
	vm.selectedDirection	= 'left';

	vm.usuarioLogado = $localStorage.usuarioLogado
	
	function init(){

		carregaVisitas()
	}

	init()


	//Esta função formata a saída para uma leitura do campo situação mais legível, além de alterar a situação para expirada a apartir da hora e data atual
	//Tornando assim, consistente e precisa
	function carregaVisitas(){	
	 	visitaService.getAll().then(function(visitas){
			classificaVisitas(visitas.data)			
		})
	}

	function carregaCondomino(nomeCondomino) {
    	return visitaService.getCondomino(nomeCondomino).then(function(condominosModel){
        	vm.dsCondominos = condominosModel.data;
       			return condominosModel.data
     	})
    }

	function finalizarVisita(visita) {
		$state.go('finalizar-visita', {visitaId: visita})
	}

	function detalharVisita(visita) {
		$state.go('detalhar-visita', {visitaId: visita})
	}

	function fnFiltraVisita(filtro) {
		vm.situacao = filtro
	}
	
	function pesquisaVisita(nomeCondomino) {
		return visitaService.getVisita(nomeCondomino).then(function(visitas) {
			classificaVisitas(visitas.data)
		})
	}

	function classificaVisitas(dsVisita){ 
		vm.dataset = dsVisita.map(function(resp){
		
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
					resp.situacao = "Agendada";
					
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
	}

	function novoVisitante(dadosVisita) {
		$state.go('novo-visitante', {visitaId: dadosVisita.id})
	}

	function novoConvidado() {
		$state.go('novo-visitante')
	}
}