angular.module('app.login')
.controller('LoginController', LoginController);

function LoginController($localStorage, loginService, $state) {
	
    vm                  = this;
    vm.mudarStatus      = mudarStatus; 
    vm.tipo             = 'password';
    vm.status           = 'show-close';  
     
    
    if ($localStorage.usuarioLogado)  {
        $localStorage.usuarioLogado = null
        window.location.reload();
    }  

	function init(){
         
	}

    init()

    vm.signUp = fnSignUp;

    function fnSignUp(){
       
        let sucesso = function(resposta) {
            $localStorage.usuarioLogado = resposta.data;
            $state.go('home')
            toastr.info("Login Efetuado com sucesso!")
           
        }

        let erro = function(repsosta) {
        
            toastr.warning("Nome de usuário ou senha inválidos!")
        }

        loginService.signUp(vm.email,vm.senha).then(sucesso, erro)    
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