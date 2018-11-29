angular.module('app.visita')
.controller('VisitaController', VisitaController);

function VisitaController(visitaService, visitaId, $localStorage) {
	
	vm = this;

	//vm.novaVisita 	= novaVisita;
	//vm.editar 		= editar;

    vm.dataset = {}
    
    function init(){
        vm.visitaReserva = new Date();
        vm.visitaReservaHora = vm.visitaReserva;
        
        if (visitaId) {
            visitaService.getById(visitaId).then(function(visitaModel){
                console.log(visitaModel.data)
                vm.dataset = visitaModel.data
            })
        }

        $localStorage.condomino = {
            id : 1002,
            nome : 'Jose Mayer'
		}
	}

    init()	
    

    vm.carregaConvidados =  carregaConvidados;
    vm.salvaVisita       = salvaVisita;

	function salvaVisita(){

        vm.visitaReserva = new Date(vm.visitaReserva)
    	vm.visitaReserva.setHours(vm.visitaReservaHora.getHours())
    	vm.visitaReserva.setMinutes(vm.visitaReservaHora.getMinutes())

    	vm.visitaReserva = new Date(vm.visitaReserva)

    	validade = new Date(vm.visitaReserva)
		validade.setHours(vm.visitaReservaHora.getHours() + 4)
        validade.setMinutes(vm.visitaReservaHora.getMinutes())
        
        var visitaModel = {},
                visita = {
                    
                    condominoId 			: $localStorage.condomino.id,
                    pessoaId    			: vm.visitaPessoaId,
                    dataHoraReserva			: vm.visitaReserva,
                    dataHoraExpiracao		: validade, 			
                    nomeConvidado			: vm.visitaConvidado,
                    condominoObservacao		: vm.visitaCondominoObservacao
                }
        
        visitaModel.visita = visita;
        console.log(visitaModel)
		visitaService.save(visitaModel)
		.then(function(){
			
		})
		.catch(function(){

		})
    }
    
    function carregaConvidados() {
        return visitaService.getConvidados().then(function(convidadosModel){
            console.log(convidadosModel.data)
            vm.dsConvidados = convidadosModel.data;
            return convidadosModel.data
        })
    }
	
}