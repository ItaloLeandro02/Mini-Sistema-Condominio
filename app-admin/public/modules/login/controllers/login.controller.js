angular.module('app.login')
.controller('LoginController', LoginController);

function LoginController($localStorage, loginService, $state) {
	
    vm = this;   
   

	function init(){
         
	}

    init()

    vm.signUp = fnSignUp;

    function fnSignUp(){
       
        let sucesso = function(resposta) {
        
            $localStorage.usuarioLogado = resposta.data;
            console.log($localStorage.usuarioLogado)
            toastr.info("Login Efetuado com sucesso!")
            $state.go('home', {nome : $localStorage.usuarioLogado.usuario.email})
        }

        let erro = function(repsosta) {
        
            toastr.warning("Nome de usuário ou senha inválidos!")
        }

        loginService.signUp(vm.email,vm.senha).then(sucesso, erro)    
    }
    
}