angular.module('app.porteiro')
.controller('PorteiroListaController', porteiroListaController);

function porteiroListaController(porteiroService, $state, $mdDialog, $stateParams) {
	
	vm = this;


	function init(){
		carregaPorteiros()
	}

	init()
    
	vm.novo 			= novo;
	vm.editar  			= editar;
	vm.excluir			= excluir; 
	vm.carregaPorteiro 	= carregaPorteiro; 

	function carregaPorteiros(){	
		porteiroService.getAll().then(function(porteiros){
			vm.dataset = porteiros.data 
            return vm.dataset
		})
    }
    
    function novo() {
        $state.go('novo-porteiro')
	}

	function editar(porteiroId) {
        $state.go('editar-porteiro', {id: porteiroId})
	}
	
    function excluir(ev, porteiro) {
		let confirmacao = $mdDialog.confirm()
	        .title('A	guardando confirmação')
			.textContent('Confirma a exclusão do porteiro ' + porteiro.pessoa.nome + '?')
	        .ariaLabel('Msg interna do botao')
	        .targetEvent(ev)
	        .ok('Sim')
	        .cancel('Não');
	    		$mdDialog.show(confirmacao).then(function() {
					porteiroService.delete(porteiro)
					.then(function(resposta){
						if (resposta.sucesso) {				
							toastr.success("Porteiro excluido com êxito :)","SUCESSO")
					   }
					   carregaPorteiros();
				   })
				   .catch(function(error){
					   console.log(error)
					   toastr.error("Tente novamente.","ERRO")
				   })
	    		});
	}

	function carregaPorteiro(nomePorteiro) {
    	return porteiroService.getPorteiro(nomePorteiro).then(function(porteirosModel){
        	vm.dataset = porteirosModel.data;
       			return vm.dataset
     	})
    }
}