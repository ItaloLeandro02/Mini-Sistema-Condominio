angular.module('appListaVisita')
.controller('visitaController', porteiroController)
.controller('editarController', editarController)
.controller('novoController', novoController)

function visitaController($scope, $resource, $mdDialog){
    

	$scope.vm = {};
	let vm = $scope.vm;

	//Cria uma variável para manipular objetos porteiro
	let visitaApi = $resource('http://127.0.0.1:3333/api/visita/:id', {id: '@id'}, {
    	update: {
    		method: 'PUT'
    	}
      });

	function init(){		
		carregaVisitas();
	} 
	init()

	vm.carregaVisitas   = carregaVisitas
	vm.editar 			= editar
	vm.novo				= novo
	vm.excluir			= excluir
	vm.excluirVisita    = excluirVisita
  	
    //Função para retornar todas as visitas no banco de dados
	function carregaVisitas(){
		vm.dsVisitas = new visitaApi();
		vm.dsVisitas.$get().then(function(resposta){			
			vm.dsVisitas.data = resposta.data;
		})	
    }

    function editar(ev, visita) {

    	$mdDialog.show({
    	 locals: { objeto: visita }, //here where we pass our data
      	 controller: 'editarController',
      	 templateUrl: 'editarVisita.html',
     	 parent: angular.element(document.body),
     	 bindToController: true,
     	 targetEvent: ev,
		})

		.then(function(edicao) {
			if (edicao) {
				carregaVisitas();
			}
		})
  	};

  	function novo(ev) {

    	$mdDialog.show({
      	 controller: 'novoController',
      	 templateUrl: 'novaVisita.html',
     	 parent: angular.element(document.body),
     	 bindToController: true,
     	 targetEvent: ev,
		})

		.then(function(edicao) {
			if (edicao) {
				carregaVisitas();
			}
		})
  	};

  	function excluir(ev, visita) {

		let confirmacao = $mdDialog.confirm()
	        .title('A	guardando confirmação')
			.textContent('Confirma a exclusão da visita da pessoa' + visita.pessoa.nome)
	        .ariaLabel('Msg interna do botao')
	        .targetEvent(ev)
	        .ok('Sim')
	        .cancel('Não');
	    		$mdDialog.show(confirmacao).then(function() {
	      			excluirVisita(visita.id)
	    		});
	}
	

	function excluirVisita(IdVisita){
		let dsVisita = new visitaApi();
			dsVisita.id = IdVisita;

		let sucesso = function(resposta){
			console.log(resposta)			
			if (resposta.dado == null) {
				toastr.info("SUCESSO","Visita excluída com êxito :)");				
			}
			carregaVisitas();
		}
		let erro = function(resposta){
			console.log(resposta);	
		}
		dsVisita.$delete({id: IdVisita},sucesso,erro);
	}
}

function editarController ($scope, $resource, $mdDialog, objeto) {

	$scope.vm = {};
	let vm = $scope.vm;

	//Cria uma variável para manipular objetos porteiro
	let visitaApi = $resource('http://127.0.0.1:3333/api/visita/:id', {id: '@id'}, {
    	update: {
    		method: 'PUT'
    	}
      });

	vm.salvar 			= salvar
	vm.cancelar			= cancelar

	
	function salvar() {
    	let dsVisita					= new visitaApi(),
        	visita = {
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
	let visitaApi = $resource('http://127.0.0.1:3333/api/visita/:id', {id: '@id'}, {
    	update: {
    		method: 'PUT'
    	}
      });

	vm.salvar 	= salvar
	vm.cancelar = cancelar

	function salvar() {

    	let dsVisita					= new visitaApi(),
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


