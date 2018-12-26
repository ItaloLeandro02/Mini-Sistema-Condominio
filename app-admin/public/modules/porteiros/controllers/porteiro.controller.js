angular.module('app.porteiro')
.controller('PorteiroController', porteiroController);

function porteiroController(porteiroService, porteiroId, $state) {
	
    vm = this;
    vm.mudarStatus      = mudarStatus; 

    vm.dataset = {}

    vm.tipo             = 'password';
    vm.status           = 'show-close';
    
    function init(){

        if (porteiroId) {
            porteiroService.getById(porteiroId).then(function(porteiroModel){
                vm.dataset = porteiroModel.data
            })
        }
	}

    init()	
    
    vm.salvaPorteiro    = salvaPorteiro;           
    vm.estados          = ('AC AL AP AM BA CE DF ES GO MA '+
    ' MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO').split(' ').map(function (estado) { return { abbrev: estado }; });

	function salvaPorteiro(){

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
    	
        var porteiroModel = {},
                
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
                

        porteiroModel.pessoa     = pessoa,
        porteiroModel.usuario    = usuario,
        porteiroModel.endereco   = endereco;

        porteiroModel.id    = porteiroId
       
		porteiroService.save(porteiroModel)
		.then(function(resposta){
             if (resposta.sucesso) {				
                if (porteiroId) {
                    toastr.info("Porteiro atualizado com êxito :)","SUCESSO")
                }
                else {
                    toastr.success("Porteiro incluído com êxito :)","SUCESSO")
                }

                $state.go('porteiro')
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