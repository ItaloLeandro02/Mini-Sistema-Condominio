angular.module('app.visita')
.controller('VisitaController', VisitaController);

function VisitaController(visitaService, visitaId, $localStorage, $state) {
	
	vm = this;

	//vm.novaVisita 	= novaVisita;
	//vm.editar 		= editar;

    vm.dataset = {}
    
    function init(){
        vm.dataset.dataHoraReserva = new Date();
        
        if (visitaId) {
            visitaService.getById(visitaId).then(function(visitaModel){
                vm.dataset = visitaModel.data
            })
        }

        $localStorage.condomino = {
            id : 1015,
            nome : 'Jose Mayer'
        }
        
        carregaContatos(1015)
	}

    init()	
    

    vm.carregaConvidados    =  carregaConvidados;
    vm.salvaVisita          = salvaVisita;
    vm.carregaContatos      = carregaContatos;

	function salvaVisita(){

        if (vm.form.$invalid) {
            toastr.error("Erro! Revise seus dados e tente novamente.","ERRO")
            return
        } 

        vm.dataset.dataHoraReserva = new Date(vm.dataset.dataHoraReserva)
    	vm.dataset.dataHoraReserva.setHours(vm.dataset.dataHoraReserva.getHours())
    	vm.dataset.dataHoraReserva.setMinutes(vm.dataset.dataHoraReserva.getMinutes())


    	validade = new Date(vm.dataset.dataHoraReserva)
		validade.setHours(vm.dataset.dataHoraReserva.getHours() + 4)
        validade.setMinutes(vm.dataset.dataHoraReserva.getMinutes())
        
        var visitaModel = {},
                visita = {
                    condominoId 			: $localStorage.condomino.id,
                    pessoaId    			: vm.dataset.pessoaId,
                    dataHoraReserva			: vm.dataset.dataHoraReserva,
                    dataHoraExpiracao		: validade, 			
                    nomeConvidado			: vm.dataset.nomeConvidado,
                    condominoObservacao		: vm.dataset.condominoObservacao
                }

        
        visitaModel = visita;
        visitaModel.id  = visitaId
       
		visitaService.save(visitaModel)
		.then(function(resposta){
             if (resposta.sucesso) {				
                if (visitaId) {
                    toastr.info("Visita atualizada com êxito :)","SUCESSO")
                }
                else {
                    toastr.success("Visita incluída com êxito :)","SUCESSO")
                }

                $state.go('visita')
            }
		})
		.catch(function(error){
            console.log(error)
            toastr.error("Erro! Revise seus dados e tente novamente.","ERRO")
		})
    }
    
    function carregaConvidados(nomeConvidado) {
        return visitaService.getConvidados($localStorage.condomino.id, nomeConvidado).then(function(convidadosModel){
            console.log(convidadosModel.data)
            vm.dsConvidados = convidadosModel.data;
            return convidadosModel.data
        })
    }

    function carregaContatos() {
        return visitaService.getContatos($localStorage.condomino.id).then(function(convidadosModel){
            console.log(convidadosModel.data)
            vm.dsContatos = convidadosModel.data;
            return convidadosModel.data
        })
    }
}