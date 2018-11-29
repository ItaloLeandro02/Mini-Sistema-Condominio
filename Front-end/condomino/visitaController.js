angular.module('appListaVisita')
.controller('visitaController', visitaController)
.controller('editarController', editarController)
.controller('novoController', novoController)

function visitaController($scope, $resource, $mdDialog, $localStorage){
    

	$scope.vm = {};
	let vm = $scope.vm;

	//Cria uma variável para manipular objetos visita
	let visitaApi = $resource('http://127.0.0.1:3333/api/visita/:id', {id: '@id'}, {
    	update: {
    		method: 'PUT'
    	}
      });

	function init(){		
		
		$localStorage.condomino = {
            id : 1002,
            nome : 'Jose Mayer'
		}
		carregaVisitas($localStorage.condomino.id);
	} 
	init()

	vm.carregaVisitas 	= carregaVisitas
	vm.editar 			= editar
	vm.novo				= novo
	vm.cancelar			= cancelar
	vm.cancelarVisita	= cancelarVisita

    //Função para retornar todos as visitas no banco de dados
	function carregaVisitas(concominoId){
		vm.dsVisitas = new visitaApi();
		 return vm.dsVisitas.$get({condomino : concominoId}).then(function(resposta){			
		  return vm.dsVisitas.data = resposta.data;
/*
		resposta = vm.dsVisitas.data 

			resposta = resposta.map(function(resp) {

				if (new Date() >= new Date(resp.dataHoraExpiracao)){
                    resp.situacao = "Expirada";
                } 

				switch(resp.situacao) {
					case 1: resp.situacao = "Agendada"
						break
					case 2: resp.situacao = "Liberada"
						break
					case 3: resp.situacao = "Expirada"
						break
					case 4: resp.situacao = "Cancelada"
						break
					case 5: resp.situacao = "Negada"
						break
				}
			})
*/
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
				location.reload();
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
				location.reload();
			}
		})
  	};

  	function cancelar(ev, visita) {

		let confirmacao = $mdDialog.confirm()
	        .title('A	guardando confirmação')
			.textContent('Confirma o cancelamento da visita ' + visita.nomeConvidado + ' as ' + visita.dataHoraReserva + '?')
	        .ariaLabel('Msg interna do botao')
	        .targetEvent(ev)
	        .ok('Sim')
	        .cancel('Não');
	    		$mdDialog.show(confirmacao).then(function() {
					cancelarVisita(visita.id)
	    		});
	}

	function cancelarVisita(IdVisita){
		let dsVisita 		= new visitaApi(),
		 		
		 		visita = {
		 			situacao 	: 4
		 		}

			dsVisita.id 	= IdVisita;
			dsVisita.visita = visita

		let sucesso = function(resposta){
			console.log(resposta)			
			if (resposta.dado == null) {
				toastr.info("SUCESSO","Visita cancelada com êxito :)");				
			}
			location.reload();
		}
		let erro = function(resposta){
			console.log(resposta);	
		}

		dsVisita.$update({id: IdVisita},sucesso,erro);
	}
}

function editarController ($scope, $resource, $mdDialog, objeto) {

	$scope.vm = {};
	let vm = $scope.vm;

	//Cria uma variável para manipular objetos visita

	//Cria uma variável para manipular objetos porteiro
	let visitaApi = $resource('http://127.0.0.1:3333/api/visita/:id', {id: '@id'}, {
    	update: {
    		method: 'PUT'
    	}
      });

	vm.salvar 			= salvar
	vm.cancelar			= cancelar
	vm.carregaVisitas	= carregaVisitas

	function carregaVisitas(){
		vm.dsVisitas = new visitaApi();
		vm.dsVisitas.$get().then(function(resposta){
		vm.dsVisitas.data = resposta.data;
		})	
    }

	function salvar() {
		
		vm.visitaReserva = new Date(vm.visitaReserva)
    	vm.visitaReserva.setHours(vm.visitaReservaHora.getHours())
    	vm.visitaReserva.setMinutes(vm.visitaReservaHora.getMinutes())

    	vm.visitaReserva = new Date(vm.visitaReserva)

    	validade = new Date(vm.visitaReserva)
		validade.setHours(vm.visitaReservaHora.getHours() + 4)
		validade.setMinutes(vm.visitaReservaHora.getMinutes())

    	let dsVisita					= new visitaApi(),
    		visita = {
				condominoId 			: vm.visitaCondominoId,
				pessoaId    			: vm.visitaPessoaId,
				dataHoraReserva			: vm.visitaReserva,
				dataHoraExpiracao		: validade, 			
    			nomeConvidado			: vm.visitaConvidado,
    			condominoObservacao		: vm.visitaCondominoObservacao
    		}

    	/*
    		//Verifica se a visita está expirada
    		if (vm.visitaSituacao == "Agendada") {
				if (new Date(validade) <= new Date()) {
					console.log(new Date())
					console.log(new Date(validade))

					visita.situacao = 3
				}
			}
		*/

        dsVisita.visita 			= visita
			
		let sucesso = function(resposta){
			console.log(resposta)
			if (resposta.sucesso) {				
					toastr.success("Visita cancelada com êxito :)","SUCESSO")	
						$mdDialog.hide(true)
			}
			carregaVisitas();
		}

		let erro = function(resposta){
			console.log(resposta)	
		}

		dsVisita.$update().then(sucesso,erro)
    };

    function cancelar() {
    	$mdDialog.cancel();
    };

	vm.visitaId 					= objeto.id
    vm.visitaConvidado			 	= objeto.nomeConvidado
    vm.visitaReserva				= objeto.dataHoraReserva
    vm.visitaCondominoObservacao 	= objeto.condominoObservacao
    vm.visitaCondominoId			= objeto.condominoId
    vm.visitaPessoaId				= objeto.pessoaId
    vm.visitaSituacao				= objeto.situacao
    vm.visitaReservaHora			= new Date(vm.visitaReserva)


	vm.estados = ('AC AL AM AP BA CE DF ES GO MA' +
	' MT MS MG PA PB PR PE PI RJ RN RO RS RR SC SE SP TO')
	.split(' ')
	.map(function(estado) {
    return {abbrev: estado};
	});
}

function novoController ($scope, $resource, $mdDialog, $localStorage) {

	$scope.vm = {};
	let vm = $scope.vm;

	let visitaApi = $resource('http://127.0.0.1:3333/api/visita/:id', {id: '@id'}, {
    	update: {
    		method: 'PUT'
    	}
	  });
	  
	let pessoaApi = $resource('http://127.0.0.1:3333/api/pessoa/:id', {id: '@id'}, {
	update: {
		method: 'PUT'
	}
	});

	let convidadosApi = $resource('http://127.0.0.1:3333/api/convidado/:id', {id: '@id'}, {
    	update: {
    		method: 'PUT'
    	}
      });


	vm.salvar 				= salvar
	vm.cancelar 			= cancelar
	vm.carregaPessoas 		= carregaPessoas
	vm.dados				= dados
	vm.buscaConvidados		= buscaConvidados
	vm.favoritar			= favoritar

	function init(){		
		carregaPessoas();
		buscaConvidados($localStorage.condomino.id);
		vm.visitaReserva 		= new Date();
	} 
	init()

	//Função para pegar os dados do autocomplete
	function dados(pessoa) {
		vm.visitaConvidado = pessoa.pessoa.nome;
		vm.visitaPessoaId  = pessoa.pessoa.id;
	}

	function carregaPessoas(){
		vm.dsPessoas = new pessoaApi();
		vm.dsPessoas.$get().then(function(resposta){		
		vm.dsPessoas.data = resposta.data;
		})	
	}
	
	function buscaConvidados(condominoId){
		vm.dsConvidados = new convidadosApi();
		return vm.dsConvidados.$get({search : condominoId}).then(function(resposta){	
			return vm.dsConvidados.data = resposta.data;
		})	
	}

	function favoritar(pessoa) {
		let dsFavorito = new convidadosApi(),
			convidado = {
				favorito	: true
			}
		dsFavorito.id 		 = pessoa.id,
		dsFavorito.convidado = convidado;

		let sucesso = function(resposta){
			console.log(resposta)
		   if (resposta.sucesso) {				
			   toastr.success("Favorito incluído com êxito :)","SUCESSO")	
		   }
		   
	   }
	   let erro = function(resposta){
		   console.log(resposta)	
	   }

	   dsFavorito.$update().then(sucesso,erro)

	}

	function salvar() {

		vm.visitaReserva = new Date(vm.visitaReserva)
    	vm.visitaReserva.setHours(vm.visitaReservaHora.getHours())
    	vm.visitaReserva.setMinutes(vm.visitaReservaHora.getMinutes())

    	vm.visitaReserva = new Date(vm.visitaReserva)

    	validade = new Date(vm.visitaReserva)
		validade.setHours(vm.visitaReservaHora.getHours() + 4)
		validade.setMinutes(vm.visitaReservaHora.getMinutes())
		

    	let dsVisita					= new visitaApi(),
    		visita = {
				condominoId 			: $localStorage.condomino.id,
				pessoaId    			: vm.visitaPessoaId,
				dataHoraReserva			: vm.visitaReserva,
				dataHoraExpiracao		: validade, 			
    			nomeConvidado			: vm.visitaConvidado,
    			condominoObservacao		: vm.visitaCondominoObservacao
    		}

    	dsVisita.visita = visita;

		let sucesso = function(resposta){
			console.log(resposta)
		   if (resposta.sucesso) {				
			   toastr.success("Visita incluída com êxito :)","SUCESSO")	
		   }
			   $mdDialog.hide(true)
		   
		   carregaVisitas();
	   }
	   let erro = function(resposta){
		   console.log(resposta)	
	   }

	   dsVisita.$save().then(sucesso,erro)
	}

	function cancelar() {
		$mdDialog.cancel();
	};
}


