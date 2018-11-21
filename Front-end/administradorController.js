angular.module('appAdministracao').controller('AdministradorController', AdministradorController);


function AdministradorController($scope, $resource, $mdDialog){
    

	console.log('Iniciando o administrador controller')
	
	$scope.vm = {};
	let vm = $scope.vm;

	//Cria uma variável para manipular objetos porteiro
	let porteiroApi = $resource('http://127.0.0.1:3333/api/porteiro/:id', {id: '@id'}, {
    	update: {
    		method: 'PUT'
    	}
      });

    //Cria uma variável para manipular objetos condômino
    let condominoApi = $resource('http://127.0.0.1:3333/api/condomino/:id', {id: '@id'}, {
    	update: {
    		method: 'PUT'
    	}
  	}); 	
	
	
    //Função para retornar todos os porteiros no banco de dados
	vm.carregaPorteiros = function(){
		vm.dsPorteiros = new porteiroApi();
		vm.dsPorteiros.$get().then(function(resposta){			
			vm.dsPorteiros.data = resposta.data;
		})	
    }

    //Função para retornar todos os condôminos no banco de dados
    vm.carregaCondominos = function(){
		vm.dsCondominos = new condominoApi();
		vm.dsCondominos.$get().then(function(resposta){			
			vm.dsCondominos.data = resposta.data;
		})	
	}

	/// Carrega todos os porteiros e condominos ao inicializar
    vm.carregaPorteiros();
    vm.carregaCondominos();

	vm.excluir = function(ev,pessoa){
		
	    let confirmacao = $mdDialog.confirm()
	          .title('Aguardando confirmação')
	          .textContent('Confirma a exclusão da pessa ' + pessoa.nome)
	          .ariaLabel('Msg interna do botao')
	          .targetEvent(ev)
	          .ok('Sim')
	          .cancel('Não');

	    $mdDialog.show(confirmacao).then(function() {
	      	vm.excluiCliente(pessoa.id)
	    });
	}
	

	vm.excluiCliente = function(IdCliente){
		let dsCliente = new clienteApi();

		dsCliente.id = IdCliente;

		let sucesso = function(resposta){			
			if (resposta.sucesso) {
				toastr.info("SUCESSO","Cliente excluído com êxito :)");				
				vm.carregaClientes();
			}
		}

		let erro = function(resposta){
			console.log(resposta)	
		}

		dsCliente.$delete({id: IdCliente},sucesso,erro);
	}

	vm.editarCliente = function(pessoa){
		if (!pessoa.id) {
			toastr.info('Pessoa não cadastrada')
			return;
		}

		vm.dataset = angular.copy(pessoa);
	}

	vm.salvaDados = function(){
		let dsCliente = new clienteApi();

		dsCliente.cliente = {			
			nome   : vm.dataset.nome,
			idade  : vm.dataset.idade
		}	

		let sucesso = function(resposta){
			console.log(resposta)
			if (resposta.sucesso) {				

				if (vm.dataset.id) {
					toastr.info("Cliente atualizado com êxito","SUCESSO")
				} else {
					toastr.success("Cliente incluído com êxito :)","SUCESSO")	
				}

				vm.limpaDados()		
				vm.carregaClientes()			
			}
		}

		let erro = function(resposta){
			console.log(resposta)	
		}

		if (vm.dataset.id) {
			dsCliente.id = vm.dataset.id;
			dsCliente.$update().then(sucesso,erro)
		} else {
		 	dsCliente.$save().then(sucesso,erro) 	
		}
	}	

	vm.limpaDados = function(){
		vm.dataset = {}				
		vm.formPessoa.$setUntouched();
	}

}