angular.module('appAdministracao')
.controller('AdministradorController', AdministradorController)
.controller('editarController', editarController)


function AdministradorController($scope, $resource, $mdDialog){
    
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

	vm.carregaPorteiros = carregaPorteiros;
  	
    //Função para retornar todos os porteiros no banco de dados
	function carregaPorteiros(){
		vm.dsPorteiros = new porteiroApi();
		console.log("Atualizou")
		vm.dsPorteiros.$get().then(function(resposta){			
			vm.dsPorteiros.data = resposta.data;
		})	
    }

    vm.editar = function(ev, porteiro) {

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
				vm.carregaPorteiros();
			}
		})
  	};
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
    	let dsPorteiro				= new porteiroApi(),
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
