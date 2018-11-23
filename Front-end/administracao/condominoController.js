angular.module('appListaCondomino')
.controller('condominoController', condominoController)
.controller('editarController', editarController)
.controller('novoController', novoController)

function condominoController($scope, $resource, $mdDialog){
    

	$scope.vm = {};
	let vm = $scope.vm;

	//Cria uma variável para manipular objetos condomino
	let condominoApi = $resource('http://127.0.0.1:3333/api/condomino/:id', {id: '@id'}, {
    	update: {
    		method: 'PUT'
    	}
      });

	function init(){		
		carregaCondominos();
	} 
	init()

	vm.carregaCondominos 	= carregaCondominos
	vm.editar 				= editar
	vm.novo					= novo
	vm.excluir				= excluir
	vm.excluirCondomino  	= excluirCondomino
  	
    //Função para retornar todos os condominos no banco de dados
	function carregaCondominos(){
		vm.dsCondominos = new condominoApi();
		vm.dsCondominos.$get().then(function(resposta){			
			vm.dsCondominos.data = resposta.data;
		})	
    }

    function editar(ev, condomino) {

    	$mdDialog.show({
    	 locals: { objeto: condomino }, //here where we pass our data
      	 controller: 'editarController',
      	 templateUrl: 'editarCondomino.html',
     	 parent: angular.element(document.body),
     	 bindToController: true,
     	 targetEvent: ev,
		})

		.then(function(edicao) {
			if (edicao) {
				carregaCondominos();
			}
		})
  	};

  	function novo(ev) {

    	$mdDialog.show({
      	 controller: 'novoController',
      	 templateUrl: 'novoCondomino.html',
     	 parent: angular.element(document.body),
     	 bindToController: true,
     	 targetEvent: ev,
		})

		.then(function(edicao) {
			if (edicao) {
				carregaCondominos();
			}
		})
  	};

  	function excluir(ev, condomino) {

		let confirmacao = $mdDialog.confirm()
	        .title('A	guardando confirmação')
			.textContent('Confirma a exclusão do condomino ' + condomino.pessoa.nome)
	        .ariaLabel('Msg interna do botao')
	        .targetEvent(ev)
	        .ok('Sim')
	        .cancel('Não');
	    		$mdDialog.show(confirmacao).then(function() {
	      			excluirCondomino(condomino.id)
	    		});
	}
	

	function excluirCondomino(IdCondomino){
			let dsCondomino 	= new condominoApi();
				dsCondomino.id 	= IdCondomino;

			let sucesso = function(resposta){
				console.log(resposta)			
				if (resposta.dado == null) {
					toastr.info("SUCESSO","Condomino excluído com êxito :)");				
				}
				carregaCondominos();
			}
			let erro = function(resposta){
				console.log(resposta);	
			}
			dsCondomino.$delete({id: IdCondomino},sucesso,erro);
	}
}

function editarController ($scope, $resource, $mdDialog, objeto) {

	$scope.vm = {};
	let vm = $scope.vm;

	//Cria uma variável para manipular objetos condomino
	let condominoApi = $resource('http://127.0.0.1:3333/api/condomino/:id', {id: '@id'}, {
    	update: {
    		method: 'PUT'
    	}
      });

	vm.salvar 			= salvar
	vm.cancelar			= cancelar

	
	function salvar() {
    	let dsCondomino					= new condominoApi(),
        	condomino = {
	        	usuario : {
	        		email 				: vm.condominoEmail,
	        		senha 				: vm.condominoSenha,
	        	},
	        	pessoa: {
	        		nome 				: vm.condominoNome,
	        		nascimento 			: vm.condominoNascimento
	        	},
	        	endereco : {
	        		logradouro 			: vm.condominoLogradouro,
	        		bairro 				: vm.condominoBairro,
	        		numero 				: vm.condominoNumero,
	        		cidade 				: vm.condominoCidade,
	        		uf 					: vm.condominoUf
	        	} 
        	}

        condomino.enderecoCondomino	 	= vm.condominoEndereco	
        dsCondomino.condomino 			= condomino
			
		let sucesso = function(resposta){
			console.log(resposta)
			if (resposta.sucesso) {				
				if (vm.condominoId) {
					toastr.info("Condomino atualizado com êxito","SUCESSO")
				} else {
					toastr.success("Condomino incluído com êxito :)","SUCESSO")	
				}

				$mdDialog.hide(true)
			}
			carregaCondominos();
		}
		let erro = function(resposta){
			console.log(resposta)	
		}
		if (vm.condominoId) {
			dsCondomino.id 		= vm.condominoId ;
			dsCondomino.$update().then(sucesso,erro)
		} else {
			dsCondomino.$save().then(sucesso,erro) 
		}	
    };

    function cancelar() {
    	$mdDialog.cancel();
    };

	vm.estados = ('AC AL AM AP BA CE DF ES GO MA' +
	' MT MS MG PA PB PR PE PI RJ RN RO RS RR SC SE SP TO')
	.split(' ')
	.map(function(estado) {
    return {abbrev: estado};
	});
	
	vm.condominoId 					= objeto.id
	vm.condominoEnderecoCondomino	= objeto.enderecoCondomino
    vm.condominoNome			 	= objeto.pessoa.nome
    vm.condominoNascimento			= objeto.pessoa.nascimento
    vm.condominoEmail				= objeto.usuario.email
    vm.condominoSenha				= objeto.usuario.senha
    vm.condominoLogradouro			= objeto.pessoa.endereco.logradouro
    vm.condominoNumero				= objeto.pessoa.endereco.numero
    vm.condominoBairro				= objeto.pessoa.endereco.bairro
    vm.condominoCidade				= objeto.pessoa.endereco.cidade
    vm.condominoUf					= objeto.pessoa.endereco.uf
}

function novoController ($scope, $resource, $mdDialog) {

	$scope.vm = {};
	let vm = $scope.vm;

	//Cria uma variável para manipular objetos condomino
	let condominoApi = $resource('http://127.0.0.1:3333/api/condomino/:id', {id: '@id'}, {
    	update: {
    		method: 'PUT'
    	}
      });

	vm.salvar 	= salvar
	vm.cancelar = cancelar

	function salvar() {
    	let dsCondomino					= new condominoApi(),
        	condomino = {
	        	usuario : {
	        		email 				: vm.condominoEmail,
	        		senha 				: vm.condominoSenha,
	        	},
	        	pessoa: {
	        		nome 				: vm.condominoNome,
	        		nascimento 			: vm.condominoNascimento,
	        		cpf					: vm.condominoCpf
	        	},
	        	endereco : {
	        		logradouro 			: vm.condominoLogradouro,
	        		bairro 				: vm.condominoBairro,
	        		numero 				: vm.condominoNumero,
	        		cidade 				: vm.condominoCidade,
	        		uf 					: vm.condominoUf
	        	} 
        	}

        condomino.enderecoCondomino 	= vm.condominoEnderecoCondomino
        dsCondomino.condomino 			= condomino
			
		let sucesso = function(resposta){
		 	console.log(resposta)
			if (resposta.sucesso) {				
				toastr.success("Condomino incluído com êxito :)","SUCESSO")	
			}
				$mdDialog.hide(true)
			
			carregaCondominos();
		}
		let erro = function(resposta){
			console.log(resposta)	
		}

		dsCondomino.$save().then(sucesso,erro)
    };

    function cancelar() {
    	$mdDialog.cancel();
    };

	vm.estados = ('AC AL AM AP BA CE DF ES GO MA' +
	' MT MS MG PA PB PR PE PI RJ RN RO RS RR SC SE SP TO')
	.split(' ')
	.map(function(estado) {
    return {abbrev: estado};
	});
}


