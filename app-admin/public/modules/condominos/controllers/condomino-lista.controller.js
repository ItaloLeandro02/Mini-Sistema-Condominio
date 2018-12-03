angular.module('app.condomino')
.controller('CondominoListaController', condominoListaController);

function condominoListaController(condominoService, $state, $mdDialog, $stateParams) {
	
	vm = this;


	function init(){
		carregaCondominos()
	}

	init()

	/*
	function carregaVisitas(){
		visitaService.getAll($localStorage.condomino.id).then(function(visitas){			
			vm.dataset = visitas.data
		})
	}
    */
    
	vm.novo 	= novo;
	vm.editar  	= editar;
	vm.excluir	= excluir;  

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
}