angular.module('app.login')
.controller('LoginController', LoginController);

function LoginController($localStorage, loginService, $state) {
	
    vm = this; 

    if ($localStorage.usuarioLogado)  {
        $localStorage.usuarioLogado = null
        $state.go('login')
    }         

    vm.signUp = fnSignUp;

    function fnSignUp(){
       
        let sucesso = function(resposta) {
        
            $localStorage.usuarioLogado = resposta.data;
            toastr.info("Login Efetuado com sucesso!")
            $state.go('home')
        }

        let erro = function(repsosta) {
        
            toastr.warning("Nome de usuário ou senha inválidos!")
        }

        loginService.signUp(vm.email,vm.senha).then(sucesso, erro)    
    }
    
}