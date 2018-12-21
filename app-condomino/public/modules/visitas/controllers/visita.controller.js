angular.module('app.visita')
.controller('VisitaController', VisitaController);

function VisitaController(visitaService, visitaId, $localStorage, $state) {
	
	vm          = this;
    vm.dataset  = {}
    vm.query    = {
        text : ''
    }
    
    function init(){

        vm.dataset.data_Hora_Reserva  = new Date();
        vm.dataHora                   = new Date();
        //vm.dataHora.setTime(vm.dataHora.getTime() + vm.dataHora.getTimezoneOffset() * 60 * 1000)
        vm.dataHora.setHours(vm.dataHora.getHours() -1)

        if (visitaId) {
            visitaService.getById(visitaId).then(function(visitaModel){
                vm.dataset = visitaModel.data
                
                    if (vm.dataset.PessoaId) {
                        vm.query.item = vm.dataset;
                    }
                    else {
                        vm.query.text = vm.dataset.nome_Convidado;
                    }
            })
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

        vm.dataset.data_Hora_Reserva  = new Date(vm.dataset.data_Hora_Reserva)
    	vm.dataset.data_Hora_Reserva.setHours(vm.dataHora.getHours())
    	vm.dataset.data_Hora_Reserva.setMinutes(vm.dataHora.getMinutes())


        validade                    = new Date(vm.dataset.data_Hora_Reserva)
        vm.dataset.nome_Convidado    = vm.query.text;
        

        if (vm.query.item) {
            
            vm.dataset.pessoa_Id     = vm.query.item.pessoa ? vm.query.item.pessoa.id : null;
        } 
        else {
            vm.dataset.pessoa_Id = null
        }
        
		validade.setHours(vm.dataset.data_Hora_Reserva.getHours() + 4)
        validade.setMinutes(vm.dataset.data_Hora_Reserva.getMinutes())
        
        var visitaModel = {},
                visita = {
                    condomino_Id 			: $localStorage.usuarioLogado.condomino.id,
                    pessoa_Id    			: vm.dataset.pessoa_Id,
                    data_Hora_Reserva	    : vm.dataset.data_Hora_Reserva,
                    data_Hora_Expiracao		: validade, 			
                    nome_Convidado			: vm.dataset.nome_Convidado,
                    condomino_Observacao	: vm.dataset.condomino_Observacao
                }

        
        visitaModel     = visita;
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
        return visitaService.getConvidados($localStorage.usuarioLogado.condomino.id, nomeConvidado).then(function(convidadosModel){
            vm.dsConvidados = convidadosModel.data;
                return convidadosModel.data
        })
    }

    function carregaContatos() {
        return visitaService.getContatos($localStorage.usuarioLogado.condomino.id).then(function(convidadosModel){
            vm.dsContatos = convidadosModel.data;
                return convidadosModel.data
        })
    }

    function dados(convidado) {
        vm.query.item               = angular.copy(convidado),
        vm.query.text               = convidado.pessoa.nome;
    }

    function favoritar(convidado) {
        if (convidado.favorito) {
            toastr.info(convidado.pessoa.nome + " já é um favorito!.","ERRO");
                return
        }

        convidado.favorito = 1;

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

        convidado.favorito = 0;

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