//Require quero o arquivo
let dataContext = require('../dao/dao');

//Orem influência o nome mão
//Primeiro requisição
function carregaTudo(req,res) {

	//Verifica o token no banco de dados
	if (req.token) {
		return dataContext.Usuario.findOne({
			where : {
				token : req.token
			}
		}).then(function(usuarios){
			res.status(200).json({
				sucesso:true,
				data: usuarios
			})
		})
	}

	return dataContext.Usuario.findAll({
		//Procura a Primary Key
    	order : 'id'
    }).then(function(usuarios){
        res.status(200).json({
        	sucesso:true,
        	data: usuarios
        })
	})
}    

function carregaPorId(req,res) {
    //req.param.id porque passei na URL
    return dataContext.Usuario.findById(req.params.id).then(function(usuario){

		//Verifica se o id passado como parâmetro na URL retornou algo
		if (!usuario) {
			res.status(404).json({
				sucesso: false,
				msg: "Usuário não encontrado."
			})
			return;
		}

		//Retorna o usuário vinculado ao id passado
        res.status(200).json({
			sucesso: true,
			data: usuario
		})
    })
} 

function salvaUsuario(req,res){

	//Variável que recebe os dados do formulário
	let usuario = req.body.usuario;

	//Verifica se os dados estão integros
	if (!usuario) {
		res.status(404).json({
			sucesso: false, 
			msg: "Formato de entrada inválido."
		})
		return;
	}

	//Definindo padrões 
	usuario.criacao 	= new Date();
	usuario.desativado 	= false;

	//Cria um objeto no banco de dados do tipo usuário com as informações passadas no formulário 
	dataContext.Usuario.create(usuario)

	//Cria uma promise passando como parâmeetro os dados do objeto criado
	.then(function(novoUsuario){
		res.status(201).json({
			sucesso	: true, 
			data	: novoUsuario
		})
	})
	.catch(function(erro){
		console.log(erro);
		res.status(409).json({ 
			sucesso: false,
			msg: "Falha ao incluir o novo usuário" 
		});
	})
}

function excluiUsuario(req,res){

	//Verifica se o parâmetro passado é o parâmetro id
	if (!req.params.id) {
		res.status(409).json({
			sucesso: false,
			msg: "Formato de entrada inválido."
		})
		return;
	}

	//Pesquisa no banco de dados o usuário correspondente ao id passado como parâmetro via URL
	dataContext.Usuario.findById(req.params.id)
	
	//Cria uma promise passando como parâmetro os dados retornados da pesquisa 
	.then(function(usuarioRetornado){
		
		//Verifica se retornou algo
		if (!usuarioRetornado) {
			res.status(404).json({
				sucesso: false,
				msg: "Usuário não encontrado."
			})
			return;
		}

		//Exclui o usuário retornado
		usuarioRetornado.destroy()

		//Cria uma promise que retorna um JSON
		.then(function(){
			res.status(200).json({
        		sucesso:true,
        		msg: "Registro excluído com sucesso",
        		data: []
        	})	        	
		})

		//Caso ocorra uma exceção
		.catch(function(erro){
			console.log(erro);
			res.status(409).json({ 
				sucesso: false,
				msg: "Falha ao excluir o usuário" 
			});	
		})
    })
}

function atualizaUsuario(req,res){
	
	//Verifica se o parâmetro passado via URL é um id
	if (!req.params.id) {
		res.status(409).json({
			sucesso: false,
			msg: "Formato de entrada inválido."
		})
		return;
	}

	//Variável que recebe os dados vindos do formulário
	let usuarioForm = req.body.usuario;

	//Verifica se retornou algo
	if (!usuarioForm) {
		res.status(404).json({
			sucesso: false,
			msg: "Formato de entrada inválido."
		})
		return;
	}

	//Pesquisa no banco de dados o usuário corresponde ao id passado como parâmetro via URL
	dataContext.Usuario.findById(req.params.id)
	
	//Cria uma promise passando como parâmetro os dados da pesquisa
	.then(function(usuarioRetornado){
		
		//Verifica se retornou algo
		if (!usuarioRetornado) {
			res.status(404).json({
				sucesso: false,
				msg: "Usuário não encontrado."
			})
			return;
		}
		
		//Campos do usuário que serão atualizados
		let updateFields = {
			email	:	usuarioForm.email,
			senha	:	usuarioForm.senha,
		}

		//Atualiza os campos do usuário
		usuarioRetornado.update(updateFields)

		//Cria uma promise que recebe como parâmetro o objeto usuário com os dados atualizados
		.then(function(usuarioAtualizado){
			res.status(200).json({
        		sucesso:true,
        		msg: "Registro atualizado com sucesso",
        		data: usuarioAtualizado
        	})	
		})

		//Caso haja uma exceção
		.catch(function(erro){
			console.log(erro);
			res.status(409).json({ 
				sucesso: false,
				msg: "Falha ao atualizar o usuário" 
			});	
		})
	})
}

module.exports = {
    carregaTudo  	: carregaTudo,
    carregaPorId 	: carregaPorId,
    salva 			: salvaUsuario,
    exclui 			: excluiUsuario,
    atualiza 		: atualizaUsuario    
}