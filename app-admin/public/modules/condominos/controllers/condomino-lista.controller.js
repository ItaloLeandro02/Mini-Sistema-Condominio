angular.module('app.condomino')
.controller('CondominoListaController', condominoListaController);

function condominoListaController(condominoService, $state, $mdDialog, $stateParams) {
	
	vm 						= this;
	vm.novo 				= novo;
	vm.editar  				= editar;
	vm.excluir				= excluir;
	vm.carregaCondomino 	= carregaCondomino;

	function init(){
		carregaCondominos()
	}

	init()
    
	function carregaCondominos(){	
		condominoService.getAll().then(function(condominos){			
			vm.dataset = condominos.data 
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
			.textContent('Confirma a exclusão do condômino ' +  '?')
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

	function carregaCondomino(nomeCondomino) {
    	return condominoService.getCondomino(nomeCondomino).then(function(condominosModel){
        	vm.dataset = condominosModel.data;
       			return condominosModel.data
     	})
    }
}