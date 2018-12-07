angular.module('app.visita')
.controller('VisitaController', VisitaController);

function VisitaController(visitaService, visitaId, $localStorage, $state) {
	
	vm          = this;
    vm.dataset  = {}
    
    function init(){
        vm.dataset.dataHoraReserva  = new Date();
        vm.dataHora                 = new Date();
        
        if (visitaId) {
            visitaService.getById(visitaId).then(function(visitaModel){
                vm.dataset = visitaModel.data
            })
        }

        $localStorage.condomino = {
            id : 2,
            nome : 'Jose Mayer'
        }
        
        carregaContatos()
	}

    init()	
    
    vm.carregaConvidados    = carregaConvidados;
    vm.salvaVisita          = salvaVisita;
    vm.carregaContatos      = carregaContatos;
    vm.dados                = dados;
    vm.favoritar            = favoritar;
    vm.desfavoritar         = desfavoritar;

	function salvaVisita(){

        if (vm.form.$invalid) {
            toastr.error("Erro! Revise seus dados e tente novamente.","ERRO")
                return
        } 

        vm.dataHora                 = new Date(vm.dataHora)

        vm.dataset.dataHoraReserva  = new Date(vm.dataset.dataHoraReserva)
    	vm.dataset.dataHoraReserva.setHours(vm.dataHora.getHours())
    	vm.dataset.dataHoraReserva.setMinutes(vm.dataHora.getMinutes())


        validade                    = new Date(vm.dataset.dataHoraReserva)
        
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
            vm.dsConvidados = convidadosModel.data;
                return convidadosModel.data
        })
    }

    function carregaContatos() {
        return visitaService.getContatos($localStorage.condomino.id).then(function(convidadosModel){
            vm.dsContatos = convidadosModel.data;
                return convidadosModel.data
        })
    }

    function dados(convidado) {
        vm.dataset.pessoaId          = convidado.pessoa.id,
        vm.dataset.nomeConvidado     = convidado.pessoa.nome;		
    }

    function favoritar(convidado) {
        if (convidado.favorito) {
            toastr.info(convidado.pessoa.nome + " já é um favorito!.","ERRO");
                return
        }

        convidado.favorito = true;

        visitaService.favorita(convidado)
        .then(function(resposta){
            if (resposta.sucesso) {				
                toastr.success(convidado.pessoa.nome +" adicionado aos favoritos :)","SUCESSO")
            }
        })
        .catch(function(error){
           toastr.error("Tente novamente.","ERRO")
        })
    }

    function desfavoritar(convidado){
        if (!convidado.favorito) {
            toastr.info(convidado.pessoa.nome + " não é um favorito!.","ERRO");
                return
        }

        convidado.favorito = false;

        visitaService.favorita(convidado)
        .then(function(resposta){
            if (resposta.sucesso) {				
                toastr.success(convidado.pessoa.nome +" removido dos favoritos :)","SUCESSO")
            }
        })
        .catch(function(error){
           toastr.error("Tente novamente.","ERRO")
        })
    }
}