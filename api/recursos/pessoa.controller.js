//Require quero o arquivo
const dataContext = require('../dao/dao'),
	 		 util = require('../util/util');	

//Orem influência o nome mão
//Primeiro requisição
function carregaTudo(req,res) {
    
	if (req.query.nome) {

		return dataContext.Pessoa.findAll({
			where : {
				nome: {
					$like : req.query.nome+'%'
				} 
			}
		})
		.then(function(pessoasFiltradas) {
	
			
			res.status(200).json({
				sucesso:true,
				data: pessoasFiltradas
			})
		})
		//Depois de filtras os nomes devo retornar isso
		
	}
	
	return dataContext.Pessoa.findAll({
		//Procura a Primary Key
    	order : 'id'
    }).then(function(pessoas){

		pessoas = pessoas.map(function(pessoasRetornadas) {
			pessoasRetornadas = pessoasRetornadas.get({plain : true})

			delete pessoasRetornadas.endereco_id

			return pessoasRetornadas
		})
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
		delete pessoa.endereco_id

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

	//Inicia uma transação
	dataContext.conexao.transaction(function(t) {

		//Variável para receber os dados do endereco criado
		let dadosEnderecoCriado

		//Cria um endereco
		return dataContext.Endereco.create(endereco, {transaction : t})
			.then(function(enderecoCriado) {
				dadosEnderecoCriado = enderecoCriado

				//Vou retornar um novo objeto Pessoa
				return dataContext.Pessoa.create({
					criacao 			: new Date(),
					digital 			: util.criaDigital(),
					nome                : pessoa.nome,
					cpf                 : pessoa.cpf,
					nascimento          : pessoa.nascimento,
					enderecoId			: dadosEnderecoCriado.id
				}, {transaction : t})
			})
	})
	//Commit
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

	//Inicia transaction
	dataContext.conexao.transaction(function(t) {

		//Recebe os dados da pessoa antes de ser excluida
		let pessoa
		//Busca a pessoa pelo id passado como parâmetro na URL
		dataContext.Pessoa.findById(req.params.id, {transaction : t})
		
		.then(function(pessoaEncontrada){
			
			//Verifica se a pessoa existe
			if (!pessoaEncontrada) {
				res.status(404).json({
					sucesso: false,
					msg: "Pessoa não encontrada."
				})
				return;
			}

			//Atribui os dados antes de ser excluida
			pessoa = pessoaEncontrada

			//Exclui o objeto pessoa, bem como os outros objetos relacionados ao seu id
			pessoaEncontrada.destroy({transaction : t})

			//Retorna o endereço vinculado a esta pessoa
			return dataContext.Endereco.findById(pessoa.enderecoId, {transaction : t})
		})
		//Cria uma promise passando como parâmetro o endereço retornado
		.then(function(enderecoRetornado) {

			//Exclui o endereco retornado
			enderecoRetornado.destroy({transaction : t})
		})
	})
	//Commit
	.then(function(){
			res.status(200).json({
        		sucesso:true,
        		msg: "Registro excluído com sucesso",
        		data: []
        	})	        	
		})

	//Roolback
	.catch(function(erro){
		console.log(erro);
		res.status(409).json({ 
			sucesso: false,
			msg: "Falha ao excluir a pessoa" 
		});	
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
	let pessoaForm	= req.body.pessoa;

	if (!pessoaForm) {
		res.status(404).json({
			sucesso: false,
			msg: "Formato de entrada inválido."
		})
		return;
	}

	//Inicia transaction
	dataContext.conexao.transaction(function(t) {

		//Pesquise antes de atualizar
		dataContext.Pessoa.findById(req.params.id, {transaction : t})
		
		.then(function(pessoa){
			if (!pessoa) {
				res.status(404).json({
					sucesso: false,
					msg: "Pessoa não encontrada."
				})
				return;
			}
			
			//Campos da Pessoa que serão alterados
			let updateFields = {
				nome 						: pessoaForm.nome,
				nascimento					: pessoaForm.nascimento
			}

			//Atualiza somente os campos Pessoa
			pessoa.update(updateFields, {transaction : t})

			//Busca o endereço vinculado a Pessoa
			return dataContext.Endereco.findById(pessoa.enderecoId, {transaction : t})
		})
		.then(function(enderecoEncontrado){

			//Campos do endereço que serão alterados
			let updateFields = {
				logradouro 			: pessoaForm.endereco.logradouro,
				numero 				: pessoaForm.endereco.numero,
				bairro 				: pessoaForm.endereco.bairro,
				cidade 				: pessoaForm.endereco.cidade,
				uf 					: pessoaForm.endereco.uf
			}

			//Atualiza somente os campos Endereço
			return enderecoEncontrado.update(updateFields, {transaction : t})

		})	
	})
	//Commit
	.then(function(pessoaAtualizada) {	
		res.status(200).json({
        sucesso:true,
        msg: "Registro atualizado com sucesso",
        data: pessoaAtualizada
        	})	
	})
	//Roolback
	.catch(function(erro){
		console.log(erro);
		res.status(409).json({ 
			sucesso: false,
			msg: "Falha ao atualizar a pessoa" 
		});	
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