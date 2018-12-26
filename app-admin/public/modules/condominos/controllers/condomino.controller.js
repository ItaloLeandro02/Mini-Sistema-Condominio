angular.module('app.condomino')
.controller('CondominoController', condominoController);

function condominoController(condominoService, condominoId, $state) {
	
	vm                  = this;
    vm.dataset          = {}
    vm.salvaCondomino   = salvaCondomino; 
    vm.mudarStatus      = mudarStatus;          
    vm.estados          = ('AC AL AP AM BA CE DF ES GO MA '+
    ' MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO').split(' ').map(function (estado) { return { abbrev: estado }; });
    vm.query            = {
        text    : '',
    }
    vm.tipo             = 'password';
    vm.status           = 'show-close';

    function init(){

        if (condominoId) {
            condominoService.getById(condominoId).then(function(condominoModel){
                vm.dataset = condominoModel
                    return vm.dataset
            })
        }
	}

    init()	
    
	function salvaCondomino(){

        if (vm.form.$invalid) {
            toastr.error("Erro! Revise seus dados e tente novamente.","ERRO")
            return
        } 

        vm.dataset.pessoa.nascimento  = new Date(vm.dataset.pessoa.nascimento)
    	
        var condominoModel = {},
                
            pessoa = {
                nome        : vm.dataset.pessoa.nome,
                nascimento  : vm.dataset.pessoa.nascimento,
                cpf         : vm.dataset.pessoa.cpf,
                
            },
            usuario = {
                email       : vm.dataset.usuario.email,
                senha       : vm.dataset.usuario.senha
            }

        condominoModel.pessoa                = pessoa,
        condominoModel.usuario               = usuario,
        condominoModel.endereco     = vm.dataset.endereco; 

        condominoModel.id                    = condominoId
       
		condominoService.save(condominoModel)
		.then(function(resposta){
             if (resposta.sucesso) {				
                if (condominoId) {
                    toastr.info("Condomino atualizado com êxito :)","SUCESSO")
                }
                else {
                    toastr.success("Condomino incluído com êxito :)","SUCESSO")
                }

                $state.go('condomino')
            }
		})
		.catch(function(error){
            console.log(error)
            toastr.error("Erro! Revise seus dados e tente novamente.","ERRO")
		})
    }

    function mudarStatus(status) {
        if (status == 'show-close') {
            vm.tipo    = 'text';
            vm.status  = 'show-open';
        }
        else {
            vm.tipo    = 'password';
            vm.status  = 'show-close';
        }
    }
}