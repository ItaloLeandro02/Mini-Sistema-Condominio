//Require quero o arquivo
let dataContext = require('../dao/dao');

//Orem influência o nome mão
//Primeiro requisição
function carregaTudo(req,res) {
    
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
		//Por padrão retorna o status
        res.status(200).json({
			sucesso: true,
			data: usuario
		})
    })


} 

function salvaUsuario(req,res){
	//req.body campos do body
	//Mesma coisa que [FromBody] no C#
	let usuario = req.body.usuario;


	if (!usuario) {
		res.status(404).json({
			sucesso: false, 
			msg: "Formato de entrada inválido."
		})
		return;
	}

	//Definindo padrão de campos
	usuario.criacao = new Date();
	usuario.desativado = false;
	//pessoa.digital = Randonica; //EX UJ-48

	dataContext.Usuario.create(usuario)
	//.then é promise
	.then(function(novoUsuario){
		res.status(201).json({
			sucesso: true, 
			data: novoUsuario
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
	if (!req.params.id) {
		res.status(409).json({
			sucesso: false,
			msg: "Formato de entrada inválido."
		})
		return;
	}

	dataContext.Usuario.findById(req.params.id).then(function(usuario){
        
		if (!usuario) {
			res.status(404).json({
				sucesso: false,
				msg: "Usuário não encontrado."
			})
			return;
		}

		usuario.destroy()
		.then(function(){
			res.status(200).json({
        		sucesso:true,
        		msg: "Registro excluído com sucesso",
        		data: []
        	})	        	
		})
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
	
	if (!req.params.id) {
		res.status(409).json({
			sucesso: false,
			msg: "Formato de entrada inválido."
		})
		return;
	}

	//No front devo retornar um objeto pessoa com os dados
	let usuario = req.body.usuario;

	if (!usuario) {
		res.status(404).json({
			sucesso: false,
			msg: "Formato de entrada inválido."
		})
		return;
	}

	//Pesquise antes de atualizar
	dataContext.Usuario.findById(req.params.id).then(function(usuario){
		
		if (!usuario) {
			res.status(404).json({
				sucesso: false,
				msg: "Usuário não encontrada."
			})
			return;
		}
		
		let updateFields = {
			//Devo fazer como no C# 
			//Retornar o JSON com vários níveis
			/*
			nome 					: usuario.nome,
			nascimento 				: usuario.nascimento,
			enderecoLogradouro 		: usuario.endereco.logradouro,
			enderecoNumero 			: usuario.endereco.numero,
			enderecoBairro 			: usuario.endereco.bairro,
			enderecoCidade 			: usuario.endereco.cidade,
			enderecoUf 				: usuario.endereco.uf,
			*/
		}

		usuario.update(updateFields)
		.then(function(usuarioAtualizado){
			res.status(200).dataContext.json({
        		sucesso:true,
        		msg: "Registro atualizado com sucesso",
        		data: usuarioAtualizado
        	})	
		})
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
	//Quando for consumir irá pegar os nomes da primeira tabela
    carregaTudo  	: carregaTudo,
    carregaPorId 	: carregaPorId,
    salva 			: salvaUsuario,
    exclui 			: excluiUsuario,
    atualiza 		: atualizaUsuario    
}