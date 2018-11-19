//Require quero o arquivo
const dataContext = require('../dao/dao'),
	  util = require('../util/util');	

//Orem influência o nome mão
//Primeiro requisição
function carregaTudo(req,res) {
    
    return dataContext.Pessoa.findAll({
		//Procura a Primary Key
    	order : 'id'
    }).then(function(pessoas){
        res.status(200).json({
        	sucesso:true,
        	data: pessoas
        })
    })
}    

function carregaPorId(req,res) {
	//req.param.id porque passei na URL
	//Retorna o objeto Pessoa e o endereço vinculado a ela
    return dataContext.Pessoa.findById(req.params.id,{
		include: [
			{
				model: dataContext.Endereco,
				
				//Retorna todos os atributos do objeto endereço, menos o id
				attributes: { exclude: ['id'] }
			}
		]

	}).then(function(pessoa){

		//Verifica se pessoa existe
		if (!pessoa) {
			res.status(404).json({
				sucesso: false,
				msg: "Pessoa não encontrada."
			})
			return;
		}

		//Transforma o objeto retornado em um objeto plano
		pessoa = pessoa.get({plain : true})

		//Deleta as informações somente na view
		//Os dados ainda existem no banco 
		delete pessoa.id
		delete pessoa.enderecoId

		//Por padrão retorna o status
        res.status(200).json({
			sucesso: true,
			data: pessoa
		})
    })
} 

function salvaPessoa(req,res){
	//req.body campos do body
	//Mesma coisa que [FromBody] no C#
	let pessoa = req.body.pessoa,

	endereco = {
			logradouro  : pessoa.endereco.logradouro,
			numero      : pessoa.endereco.numero,
			bairro      : pessoa.endereco.bairro,
			cidade      : pessoa.endereco.cidade,
			uf          : pessoa.endereco.uf,
		}

	if (!pessoa) {
		res.status(404).json({
			sucesso: false, 
			msg: "Formato de entrada inválido."
		})
		return;
	}

	//Variável para receber os dados do endereco criado
	let dadosEnderecoCriado

	//Cria um endereco
	dataContext.Endereco.create(endereco).then(function(enderecoCriado) {
		dadosEnderecoCriado = enderecoCriado

		//Vou retornar um novo objeto Pessoa
		return dataContext.Pessoa.create({
			criacao 			: new Date(),
			digital 			: util.criaDigital(),
			nome                : pessoa.nome,
			cpf                 : pessoa.cpf,
			nascimento          : pessoa.nascimento,
			enderecoId			: dadosEnderecoCriado.id
		})
	})
	//.then é promise
	.then(function(novaPessoa){
		res.status(201).json({
			sucesso: true, 
			data: novaPessoa
		})
	})
	.catch(function(erro){
		console.log(erro);
		res.status(409).json({ 
			sucesso: false,
			msg: "Falha ao incluir a nova pessoa" 
		});
	})
}

function excluiPessoa(req,res){
	if (!req.params.id) {
		res.status(409).json({
			sucesso: false,
			msg: "Formato de entrada inválido."
		})
		return;
	}

	dataContext.Pessoa.findById(req.params.id).then(function(pessoa){
        
		if (!pessoa) {
			res.status(404).json({
				sucesso: false,
				msg: "Pessoa não encontrada."
			})
			return;
		}

		pessoa.destroy()
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
				msg: "Falha ao excluir a pessoa" 
			});	
		})

    })
	
}

function atualizaPessoa(req,res){
	
	if (!req.params.id) {
		res.status(409).json({
			sucesso: false,
			msg: "Formato de entrada inválido."
		})
		return;
	}

	//No front devo retornar um objeto pessoa com os dados
	let pessoa		= req.body.pessoa;
	let pessoaForm	= req.body.pessoa;

	if (!pessoa && !pessoaForm) {
		res.status(404).json({
			sucesso: false,
			msg: "Formato de entrada inválido."
		})
		return;
	}

	//Pesquise antes de atualizar
	dataContext.Pessoa.findById(req.params.id).then(function(pessoa){
		if (!pessoa) {
			res.status(404).json({
				sucesso: false,
				msg: "Pessoa não encontrada."
			})
			return;
		}
		
		let updateFields = {
			//Devo fazer como no C# 
			//Retornar o JSON com vários níveis
			nome 						: pessoaForm.nome,
			
			/*
			nascimento 					: pessoaFormnascimento,
			enderecoLogradouro 			: pessoaFormendereco.logradouro,
			enderecoNumero 				: pessoaFormendereco.numero,
			enderecoBairro 				: porteiroForm.pessoa.endereco.bairro,
			enderecoCidade 				: porteiroForm.pessoa.endereco.cidade,
			enderecoUf 					: porteiroForm.pessoa.endereco.uf
			*/
		}

		pessoa.update(updateFields)
		.then(function(pessoaAtualizada){
			res.status(200).json({
        		sucesso:true,
        		msg: "Registro atualizado com sucesso",
        		data: pessoaAtualizada
        	})	
		})
		.catch(function(erro){
			console.log(erro);
			res.status(409).json({ 
				sucesso: false,
				msg: "Falha ao atualizar a pessoa" 
			});	
		})

	})
	
}

module.exports = {
	//Quando for consumir irá pegar os nomes da primeira tabela
    carregaTudo  	: carregaTudo,
    carregaPorId 	: carregaPorId,
    salva 			: salvaPessoa,
    exclui 			: excluiPessoa,
	atualiza 		: atualizaPessoa,  
}