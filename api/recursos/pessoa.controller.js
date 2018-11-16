//Require quero o arquivo
let dataContext = require('../dao/dao');

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
    return dataContext.Pessoa.findById(req.params.id).then(function(pessoa){
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
	let pessoa = req.body.pessoa;

	pessoa.criacao = new Date();
	//pessoa.digital = Randonica; //EX UJ-48

	if (!pessoa) {
		res.status(404).json({
			sucesso: false, 
			msg: "Formato de entrada inválido."
		})
		return;
	}

	
	dataContext.Pessoa.create(pessoa)
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
	let pessoa = req.body.pessoa;

	if (!pessoa) {
		res.status(404).json({
			sucesso: false,
			msg: "Formato de entrada inválido."
		})
		return;
	}

	//Pesquise antes de atualizar
	dataset.Pessoa.findById(req.params.id).then(function(pessoa){
		
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
			nome 					: pessoa.nome,
			nascimento 				: pessoa.nascimento,
			enderecoLogradouro 		: pessoa.endereco.logradouro,
			enderecoNumero 			: pessoa.endereco.numero,
			enderecoBairro 			: pessoa.endereco.bairro,
			enderecoCidade 			: pessoa.endereco.cidade,
			enderecoUf 				: pessoa.endereco.uf,
		}

		pessoa.update(updateFields)
		.then(function(pessoaAtualizada){
			res.status(200).dataContextjson({
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
    atualiza 		: atualizaPessoa    
}