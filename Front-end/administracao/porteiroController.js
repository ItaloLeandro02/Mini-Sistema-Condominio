angular.module('appPorteiro')
.controller('porteiroController', porteiroController)
.controller('editarController', editarController)
.controller('novoController', novoController)

function porteiroController($scope, $resource, $mdDialog){
    

	$scope.vm = {};
	let vm = $scope.vm;

	//Cria uma variável para manipular objetos porteiro
	let porteiroApi = $resource('http://127.0.0.1:3333/api/porteiro/:id', {id: '@id'}, {
    	update: {
    		method: 'PUT'
    	}
      });

	function init(){		
		carregaPorteiros();
	} 
	init()

	vm.carregaPorteiros = carregaPorteiros
	vm.editar 			= editar
	vm.novo				= novo
	vm.excluir			= excluir
	vm.excluirPorteiro  = excluirPorteiro
  	
    //Função para retornar todos os porteiros no banco de dados
	function carregaPorteiros(){
		vm.dsPorteiros = new porteiroApi();
		vm.dsPorteiros.$get().then(function(resposta){			
			vm.dsPorteiros.data = resposta.data;
		})	
    }

    function editar(ev, porteiro) {

    	$mdDialog.show({
    	 locals: { objeto: porteiro }, //here where we pass our data
      	 controller: 'editarController',
      	 templateUrl: 'editarPorteiro.html',
     	 parent: angular.element(document.body),
     	 bindToController: true,
     	 targetEvent: ev,
		})

		.then(function(edicao) {
			if (edicao) {
				carregaPorteiros();
			}
		})
  	};

  	function novo(ev) {

    	$mdDialog.show({
      	 controller: 'novoController',
      	 templateUrl: 'novoPorteiro.html',
     	 parent: angular.element(document.body),
     	 bindToController: true,
     	 targetEvent: ev,
		})

		.then(function(edicao) {
			if (edicao) {
				carregaPorteiros();
			}
		})
  	};

  	function excluir(ev, porteiro) {

		let confirmacao = $mdDialog.confirm()
	        .title('A	guardando confirmação')
			.textContent('Confirma a exclusão do porteiro ' + porteiro.pessoa.nome)
	        .ariaLabel('Msg interna do botao')
	        .targetEvent(ev)
	        .ok('Sim')
	        .cancel('Não');
	    		$mdDialog.show(confirmacao).then(function() {
	      			excluirPorteiro(porteiro.id)
	    		});
	}
	

	function excluirPorteiro(IdPorteiro){
		let dsPorteiro = new porteiroApi();
			dsPorteiro.id = IdPorteiro;

		let sucesso = function(resposta){
			console.log(resposta)			
			if (resposta.dado == null) {
				toastr.info("SUCESSO","Porteiro excluído com êxito :)");				
			}
			carregaPorteiros();
		}
		let erro = function(resposta){
			console.log(resposta);	
		}
		dsPorteiro.$delete({id: IdPorteiro},sucesso,erro);
	}
}

function editarController ($scope, $resource, $mdDialog, objeto) {

	$scope.vm = {};
	let vm = $scope.vm;

	//Cria uma variável para manipular objetos porteiro
	let porteiroApi = $resource('http://127.0.0.1:3333/api/porteiro/:id', {id: '@id'}, {
    	update: {
    		method: 'PUT'
    	}
      });

	vm.salvar 			= salvar
	vm.cancelar			= cancelar

	
	function salvar() {
    	let dsPorteiro					= new porteiroApi(),
        	porteiro = {
	        	usuario : {
	        		email 				: vm.porteiroEmail,
	        		senha 				: vm.porteiroSenha,
	        	},
	        	pessoa: {
	        		nome 				: vm.porteiroNome,
	        		nascimento 			: vm.porteiroNascimento
	        	},
	        	endereco : {
	        		logradouro 			: vm.porteiroLogradouro,
	        		bairro 				: vm.porteiroBairro,
	        		numero 				: vm.porteiroNumero,
	        		cidade 				: vm.porteiroCidade,
	        		uf 					: vm.porteiroUf
	        	} 
        	}

        dsPorteiro.porteiro = porteiro
			
		let sucesso = function(resposta){
			console.log(resposta)
			if (resposta.sucesso) {				
				if (vm.porteiroId) {
					toastr.info("Porteiro atualizado com êxito","SUCESSO")
				} else {
					toastr.success("Porteiro incluído com êxito :)","SUCESSO")	
				}

				$mdDialog.hide(true)
			}
			carregaPorteiros();
		}
		let erro = function(resposta){
			console.log(resposta)	
		}
		if (vm.porteiroId) {
			dsPorteiro.id 		= vm.porteiroId ;
			dsPorteiro.$update().then(sucesso,erro)
		} else {
			dsPorteiro.$save().then(sucesso,erro) 
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
	
	vm.porteiroId 					= objeto.id
    vm.porteiroNome			 		= objeto.pessoa.nome
    vm.porteiroNascimento			= objeto.pessoa.nascimento
    vm.porteiroEmail				= objeto.usuario.email
    vm.porteiroSenha				= objeto.usuario.senha
    vm.porteiroLogradouro			= objeto.pessoa.endereco.logradouro
    vm.porteiroNumero				= objeto.pessoa.endereco.numero
    vm.porteiroBairro				= objeto.pessoa.endereco.bairro
    vm.porteiroCidade				= objeto.pessoa.endereco.cidade
    vm.porteiroUf					= objeto.pessoa.endereco.uf
}

function novoController ($scope, $resource, $mdDialog) {

	$scope.vm = {};
	let vm = $scope.vm;

	//Cria uma variável para manipular objetos porteiro
	let porteiroApi = $resource('http://127.0.0.1:3333/api/porteiro/:id', {id: '@id'}, {
    	update: {
    		method: 'PUT'
    	}
      });

	vm.salvar 	= salvar
	vm.cancelar = cancelar

	function salvar() {

	senha 	= document.novoPorteiroForm.senha.value
	senha1 	= document.novoPorteiroForm.senha1.value
 
	if (senha == senha1) {
		vm.porteiroSenha = senha
	}
	else {
		alert("SENHAS DIFERENTES")
	}

    	let dsPorteiro					= new porteiroApi(),
        	porteiro = {
	        	usuario : {
	        		email 				: vm.porteiroEmail,
	        		senha 				: vm.porteiroSenha,
	        	},
	        	pessoa: {
	        		nome 				: vm.porteiroNome,
	        		nascimento 			: vm.porteiroNascimento,
	        		cpf					: vm.porteiroCpf
	        	},
	        	endereco : {
	        		logradouro 			: vm.porteiroLogradouro,
	        		bairro 				: vm.porteiroBairro,
	        		numero 				: vm.porteiroNumero,
	        		cidade 				: vm.porteiroCidade,
	        		uf 					: vm.porteiroUf
	        	} 
        	}

        dsPorteiro.porteiro = porteiro
			
		let sucesso = function(resposta){
		 	console.log(resposta)
			if (resposta.sucesso) {				
				toastr.success("Porteiro incluído com êxito :)","SUCESSO")	
			}
				$mdDialog.hide(true)
			
			carregaPorteiros();
		}
		let erro = function(resposta){
			console.log(resposta)	
		}

		dsPorteiro.$save().then(sucesso,erro)
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


