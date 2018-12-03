angular.module('app.condomino')
.controller('CondominoController', condominoController);

function condominoController(condominoService, condominoId, $state) {
	
	vm = this;

    vm.dataset = {}
    
    function init(){

        if (condominoId) {
            condominoService.getById(condominoId).then(function(condominoModel){
                vm.dataset = condominoModel.data
            })
        }

        /*
        $localStorage.condomino = {
            id : 1015,
            nome : 'Jose Mayer'
        }
        */
	}

    init()	
    
    vm.salvaCondomino    = salvaCondomino;           
    vm.estados          = ('AC AL AP AM BA CE DF ES GO MA '+
    ' MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO').split(' ').map(function (estado) { return { abbrev: estado }; });

	function salvaCondomino(){

        if (vm.form.$invalid) {
            toastr.error("Erro! Revise seus dados e tente novamente.","ERRO")
            return
        } 

        vm.dataset.pessoa.nascimento  = new Date(vm.dataset.pessoa.nascimento)

        if (vm.dataset.pessoa.endereco) {

                var endereco = {
                    logradouro      : vm.dataset.pessoa.endereco.logradouro,
                    numero          : vm.dataset.pessoa.endereco.numero,
                    bairro          : vm.dataset.pessoa.endereco.bairro,
                    cidade          : vm.dataset.pessoa.endereco.cidade,
                    uf              : vm.dataset.pessoa.endereco.uf
                }

                vm.dataset.endereco = endereco
        }
    	
        var condominoModel = {},
                
            pessoa = {
                nome        : vm.dataset.pessoa.nome,
                nascimento  : vm.dataset.pessoa.nascimento,
                cpf         : vm.dataset.pessoa.cpf
            },
            usuario = {
                email       : vm.dataset.usuario.email,
                senha       : vm.dataset.usuario.senha
            },
            endereco = {
                logradouro  : vm.dataset.endereco.logradouro,
                numero      : vm.dataset.endereco.numero,
                bairro      : vm.dataset.endereco.bairro,
                cidade      : vm.dataset.endereco.cidade,
                uf          : vm.dataset.endereco.uf                    
            }                    
                

        condominoModel.pessoa                = pessoa,
        condominoModel.usuario               = usuario,
        condominoModel.endereco              = endereco;
        condominoModel.enderecoCondomino     = vm.dataset.enderecoCondomino; 

        condominoModel.id    = condominoId
       
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
}