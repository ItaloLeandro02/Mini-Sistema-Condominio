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
        vm.nome_Convidado   = vm.dataset.nome_Convidado

	}

    init()	
    
    vm.salvaVisita          = salvaVisita;
    vm.salvaVisitante       = salvaVisitante;
    vm.pesquisaCondomino    = pesquisaCondomino;
    vm.estados              = ('AC AL AP AM BA CE DF ES GO MA '+
    ' MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO').split(' ').map(function (estado) { return { abbrev: estado }; });

	function salvaVisita(){

        if (vm.form.$invalid) {
            toastr.error("Erro! Revise seus dados e tente novamente.","ERRO")
            return
        } 
        
       vm.dataset.portaria_Data_Hora_Chegada  = new Date()
       
        var visitaModel = {
                situacao 			        : vm.dataset.situacao,
                porteiro_Id    			    : $localStorage.usuarioLogado.porteiro.id,
                portaria_Data_Hora_Chegada	: vm.dataset.portaria_Data_Hora_Chegada,
                portaria_Observacao		    : vm.dataset.portaria_Observacao		
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
            vm.dataset.condomino_Id = vm.query.item.id;
        }

        if (vm.form.$invalid) {
            toastr.error("Erro! Revise seus dados e tente novamente.","ERRO")
            return
        } 

        var pessoaModel = {
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

        nome_Visitante          = vm.dataset.pessoa.nome;
        pessoaModel.endereco    = endereco;
       
		visitaService.save(pessoaModel)
		.then(function(resposta){
            if (resposta.sucesso) {
              
                //Salvando dados Convidado
                var convidadoModel = {
                        pessoa_Id       : resposta.data.id,
                        condomino_Id    : vm.dataset.condomino_Id
                }


                    return visitaService.saveVisitante(convidadoModel)
            }
        })
        //Atualizando Visita
        .then(function(pessoaModel) {
            var visitaModel = {},
                visita = {
                    pessoa_Id       : pessoaModel.data.pessoa_Id,
                    nome_Convidado  : nome_Visitante
                }

            visitaModel       = visita;
            visitaModel.id    = visitaRecord.id
            
            visitaService.updateVisita(visitaModel)

            $state.go('visita')
            toastr.success("Visitante incluído com êxito :)","SUCESSO")
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