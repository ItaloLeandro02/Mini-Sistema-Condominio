angular.module('app.visita')
.controller('VisitaController', VisitaController);

function VisitaController(visitaService, $localStorage, $state, $stateParams, visitaRecord) {
	
	vm = this;

	vm.novoVisitante 	= novoVisitante;

    vm.dataset = {}
    vm.query = {
        text : ''
    }
    
    
    function init(){

        vm.usuarioLogado    = $localStorage.usuarioLogado
        vm.dataset          = visitaRecord
        vm.nomeConvidado    = vm.dataset.nomeConvidado

	}

    init()	
    
    vm.salvaVisita          = salvaVisita;
    vm.salvaVisitante       = salvaVisitante;
    vm.pesquisaCondomino    = pesquisaCondomino;
    vm.estados              = ('AC AL AP AM BA CE DF ES GO MA '+
    ' MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO').split(' ').map(function (estado) { return { abbrev: estado }; });
    vm.situacao             = ('Liberar Negar').split(' ').map(function (situacao) { return { descricao: situacao }; });

	function salvaVisita(){

        if (vm.form.$invalid) {
            toastr.error("Erro! Revise seus dados e tente novamente.","ERRO")
            return
        } 

        if (vm.dataset.situacao == 'Liberar') {
            vm.dataset.situacao = 2
            
        }
        else {
            vm.dataset.situacao = 5
            
        }
       vm.dataset.dataHoraChegada  = new Date()
        var visitaModel = {
                situacao 			        : vm.dataset.situacao,
                porteiroId    			    : $localStorage.usuarioLogado.porteiro.id,
                portariaDataHoraChegada	    : vm.dataset.dataHoraChegada,
                portariaObservacao		    : vm.dataset.portariaObservacao		
            }

        visitaModel.id  = visitaRecord.id
       
		visitaService.updateVisitaPortaria(visitaModel)
		.then(function(resposta){
             if (resposta.data.situacao == 2) {				
                toastr.info("Visita Liberada com êxito :)","SUCESSO")
             }
             else {
                toastr.success("Visita Negada com êxito :)","SUCESSO")
             }

             $state.go('visita')
            
		})
		.catch(function(error){
            console.log(error)
            toastr.error("Erro! Revise seus dados e tente novamente.","ERRO")
		})
    }

    function salvaVisitante() {
        if (vm.query.item) {
            vm.dataset.condominoId = vm.query.item.id;
        }
        console.log(vm.query)
        if (vm.form.$invalid) {
            toastr.error("Erro! Revise seus dados e tente novamente.","ERRO")
            return
        } 

        var pessoaModel = {},
                pessoa = {
                    //condominoId 			: $localStorage.condomino.id,
                    nome                    : vm.dataset.pessoa.nome,
                    cpf                     : vm.dataset.pessoa.cpf,
                    nascimento              : vm.dataset.pessoa.nascimento,
                },
                endereco = {
                    logradouro              : vm.dataset.endereco.logradouro,
                    numero                  : vm.dataset.endereco.numero,
                    bairro                  : vm.dataset.endereco.bairro,
                    cidade                  : vm.dataset.endereco.cidade,
                    uf                      : vm.dataset.endereco.uf
                }

        nomeVisitante           = vm.dataset.pessoa.nome;
        pessoaModel             = pessoa;
        pessoaModel.endereco    = endereco;
       
		visitaService.save(pessoaModel)
		.then(function(resposta){
          if (resposta.sucesso) {
              
            //Salvando dados Convidado
             var convidadoModel = {},
                 convidado = {
                     pessoaId       : resposta.data.id,
                     condominoId    : vm.dataset.condominoId
                 }
             

             convidadoModel = convidado;
              visitaService.saveVisitante(convidadoModel)

             //Atualizando Visita
             .then(function(pessoaModel) {
                 var visitaModel = {},
                     visita = {
                         pessoaId       : pessoaModel.data.pessoaId,
                         nomeConvidado  : nomeVisitante
                     }

                  visitaModel       = visita;
                  visitaModel.id    = visitaRecord.id
                  
                  visitaService.updateVisita(visitaModel)
             })

            toastr.success("Visitante incluído com êxito :)","SUCESSO")
              $state.go('visita')
            }
		})
		.catch(function(error){
            console.log(error)
            toastr.error("Erro! Revise seus dados e tente novamente.","ERRO")
		})
    }

    function pesquisaCondomino(nomeCondomino) {
		return visitaService.getCondomino(nomeCondomino).then(function(condominoModel) {
			console.log(condominoModel.data)
			return condominoModel.data;
		})
    }

    function novoVisitante(dadosVisita) {
		$state.go('novo-visitante', {visitaId: dadosVisita.id})
	}
}