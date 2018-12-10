angular.module('app.login')
.controller('LoginController', LoginController);

function LoginController($localStorage, loginService, $state) {
	
    vm = this;   
   

	function init(){
         
	}

    init()

    vm.signUp = fnSignUp;

    function fnSignUp(){
        loginService.signUp(vm.email,vm.senha).then(function(resposta){
            if (resposta.sucesso) {
                $localStorage.usuarioLogado = resposta.data;
                $state.go('home')
            } else {
                toastr.info("Nome de usuário ou senha inválidos!")
            }        
        })    
    }
    
}