angular.module('app.visita')
.controller('VisitaController', VisitaController);

function VisitaController(visitaService, visitaId) {
	
	vm = this;

	//vm.novaVisita 	= novaVisita;
	//vm.editar 		= editar;

    vm.dataset = {}
    
    function init(){
        if (visitaId) {
            
            visitaService.getById(visitaId).then(function(visitaModel){
                console.log(visitaModel)
                vm.dataset = visitaModel.data
            })
        }
	}

    init()	
    

    vm.carregaConvidados =  carregaConvidados;

	function salvaVisita(){
		var visitaModel = {};

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