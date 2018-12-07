angular.module('app.condomino')
.controller('CondominoListaController', condominoListaController);

function condominoListaController(condominoService, $state, $mdDialog, $stateParams) {
	
	vm 						= this;
	vm.novo 				= novo;
	vm.editar  				= editar;
	vm.excluir				= excluir;
	vm.calcularIdade 		= calcularIdade;
	vm.carregaCondomino 	= carregaCondomino;

	function init(){
		carregaCondominos()
	}

	init()
    
	function carregaCondominos(){	
		condominoService.getAll().then(function(condominos){			
			vm.dataset = condominos.data 
			console.log(vm.dataset)
           		return vm.dataset
		})
    }
    
    function novo() {
        $state.go('novo-condomino')
	}

	function editar(condominoId) {
        $state.go('editar-condomino', {id: condominoId})
	}
	
    function excluir(ev, condomino) {
		let confirmacao = $mdDialog.confirm()
	        .title('A	guardando confirmação')
			.textContent('Confirma a exclusão do condômino ' + condomino.pessoa.nome + '?')
	        .ariaLabel('Msg interna do botao')
	        .targetEvent(ev)
	        .ok('Sim')
	        .cancel('Não');
	    		$mdDialog.show(confirmacao).then(function() {
					condominoService.delete(condomino)
					.then(function(resposta){
						if (resposta.sucesso) {				
							toastr.success("Condomino excluido com êxito :)","SUCESSO")
					   	}
					   carregaCondominos();
				   	})
				   	.catch(function(error){
					   console.log(error)
					   toastr.error("Tente novamente.","ERRO")
				  	})
	    		});
	}
	
	function calcularIdade(ano_aniversario, mes_aniversario, dia_aniversario) {
		var d = new Date,
			ano_atual = d.getFullYear(),
			mes_atual = d.getMonth() + 1,
			dia_atual = d.getDate(),
	
			ano_aniversario = +ano_aniversario,
			mes_aniversario = +mes_aniversario,
			dia_aniversario = +dia_aniversario,
	
			quantos_anos = ano_atual - ano_aniversario;
	
				if (mes_atual < mes_aniversario || mes_atual == mes_aniversario && dia_atual < dia_aniversario) {
					quantos_anos--;
				}
	
					return quantos_anos < 0 ? 0 : quantos_anos;
	}

	function carregaCondomino(nomeCondomino) {
    	return condominoService.getCondomino(nomeCondomino).then(function(condominosModel){
        	vm.dataset = condominosModel.data;
       			return condominosModel.data
     	})
    }
}