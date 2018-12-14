//Require quero o arquivo
const dataContext = require('../dao/dao'),
	  util        = require('../util/util');

//Orem influência o nome mão
//Primeiro requisição
function carregaTudo(req,res) {
	
	if (req.query.nomePorteiro) {
		return dataContext.Porteiro.findAll({
			
			include : [
				{
					model : dataContext.Usuario,
					//attributes: { exclude: ['senha'] },
					
				},
				{
					model : dataContext.Pessoa,
					attributes: { exclude: ['endereco_id'] },

					where : {
						nome : {
							$like : '%'+req.query.nomePorteiro+'%'
						}
					},

					//Inclue o endereço associado a Pessoa
					include : {

						model : dataContext.Endereco,
					}
				},
			]
		}).then(function(porteiros){

			porteiros = porteiros.map(function(porteiroRetornado) {
				porteiroRetornado = porteiroRetornado.get({plain : true})

				delete porteiroRetornado.pessoa_id
				delete porteiroRetornado.usuario_id

				return porteiroRetornado
			})
			res.status(200).json({
				sucesso:true,
				data: porteiros	
			})
		})
	}

	return dataContext.Porteiro.findAll({
			
		include : [
			{
				model : dataContext.Usuario,
				//attributes: { exclude: ['senha'] },
				
			},
			{
				model : dataContext.Pessoa,
				attributes: { exclude: ['endereco_id'] },

				//Inclue o endereço associado a Pessoa
				include : {

					model : dataContext.Endereco,
				}
			},
		]
	}).then(function(porteiros){

		porteiros = porteiros.map(function(porteiroRetornado) {
			porteiroRetornado = porteiroRetornado.get({plain : true})

			delete porteiroRetornado.pessoa_id
			delete porteiroRetornado.usuario_id

			return porteiroRetornado
		})
		res.status(200).json({
			sucesso:true,
			data: porteiros	
		})
	})
	
}    

function carregaPorId(req,res) {

    //req.param.id porque passei na URL
    return dataContext.Porteiro.findById(req.params.id,{
        include : [
            {
				model : dataContext.Usuario,
            },
            {
				model : dataContext.Pessoa,
				attributes: { exclude: ['endereco_id'] },

				//Inclue o endereço associado a Pessoa
				include : {

					model : dataContext.Endereco,
				}
			},
		]
		    
    }).then(function(porteiro){

        if (!porteiro) {
			res.status(404).json({
				sucesso: false,
				msg: "Porteiro não encontrado."
			})
			return;
		}
		
        porteiro = porteiro.get({plain : true})

        delete porteiro.pessoa_id;
		delete porteiro.usuario_id;

        /*
        porteiro = {...porteiro.usuario, ...porteiro.pessoa, ...porteiro}
        delete porteiro.pessoa;
        delete porteiro.usuario;
        */

        //Por padrão retorna o status
        res.status(200).json({
			sucesso: true,
			data: porteiro
		})
    })

} 

function salvaPorteiro(req,res){
	//req.body campos do body
	//Mesma coisa que [FromBody] no C#
	let porteiro = req.body.porteiro,
		//Variável com os campos do usuário
        usuario = {
            email : porteiro.usuario.email,
            senha : porteiro.usuario.senha,
            tipo  : 1,
            desativado : false,
            criacao : new Date()
		},
		//Váriavel com os campos da pessoa
        pessoa = {
            nome                : porteiro.pessoa.nome,
            cpf                 : porteiro.pessoa.cpf,
            nascimento          : porteiro.pessoa.nascimento,
            digital             : util.criaDigital(),
			criacao             : new Date()
		},
		//Variável com os campos do endereço
		endereco = {
			logradouro  : porteiro.endereco.logradouro,
            numero      : porteiro.endereco.numero,
            bairro      : porteiro.endereco.bairro,
            cidade      : porteiro.endereco.cidade,
            uf          : porteiro.endereco.uf,
		}

	if (!porteiro) {
		res.status(404).json({
			sucesso: false, 
			msg: "Formato de entrada inválido."
		})
		return;
	}    
	
	//Iniciando transação
	return dataContext.conexao.transaction(function (t) {

		//variavel para receber o usuario criado devido ao "Clojure"
		let dadosUsuarioCriado

		//Cria um objeto usuario no banco de dados
			return dataContext.Usuario.create(usuario, {transaction : t})
				//Cria uma promise passando como parâmetro o objeto criado 
				.then(function(novoUsuario){
					//Atribui o objeto passado como parâmetro para ser usado na criação do porteiro
					dadosUsuarioCriado = novoUsuario;
					//Cria um objeto endereco no banco de dados
					return dataContext.Endereco.create(endereco, {transaction : t})
				})

				//Cria uma promise passando como parâmetro o objeto criado
				.then(function(enderecoCriado) {
					//Atribuia ao campo endereco_id o valor do id do endereco criado
					pessoa.enderecoId = enderecoCriado.id
					//Cria um objeto pessoa no banco de dados
					return dataContext.Pessoa.create(pessoa, {transaction : t})
				})
				
				//Cria uma promise passando como parâmetro o objeto criado
				.then(function(novaPessoa){
					//Cria un objeto porteiro no banco de dados
					return 	dataContext.Porteiro.create({
							usuarioId : dadosUsuarioCriado.id,
							pessoaId  : novaPessoa.id
					}, {transaction : t})
				})
	})//Finaliza transação

	//Comit
	.then(function(resultado){
	
		res.status(201).json({
			sucesso : true,
			data 	: resultado
		})
	})
	//Caso haja uma exceção
	.catch(function(erro){
		console.log(erro)
		res.status(409).json({ 
			sucesso: false,
			msg: "Falha ao incluir o porteiro" 
		})
	})
}

function excluiPorteiro(req,res){
	if (!req.params.id) {
		res.status(409).json({
			sucesso: false,
			msg: "Formato de entrada inválido."
		})
		return;
	}

	//váriavel para receber os valores retornados
	let porteiroRetornado
	let pessoaRetornada

	//Iniciando tansaction
	dataContext.conexao.transaction(function(t) {

		//Procura o porteiro pelo id passado pela URL
		return dataContext.Porteiro.findById(req.params.id, {transaction : t}).then(function(porteiro) {
			
			//Atribui os dados do porteiro encontrado para serem usados fora da função
			porteiroRetornado = porteiro

			//Verifica se o porteiro existe
			if (!porteiro) {
				res.status(404).json({
					sucesso: false,
					msg: "Porteiro não encontrado."
				})
				return;
			}

			//Exclui somente o porteiro
			porteiro.destroy({transaction : t})

			//Retorna o objeto pessoa vinculado ao porteiro
			return dataContext.Pessoa.findById(porteiroRetornado.pessoaId, {transaction : t})

			//Chama uma promise passando como parâmetro os dados retornados da pessoa vínculada
		})
		.then(function(pessoa) {

			//Atribui os dados da pessoa encontrada pare serem usados fora da função
			pessoaRetornada = pessoa

			//Exclui a pessoa vinculada
			pessoa.destroy({transaction : t})

			//Retorna o objeto endereço vinculado ao porteiro
			return dataContext.Endereco.findById(pessoaRetornada.enderecoId, {transaction : t})
		})
		
		//Cria uma promise passando como parâmetro os dados retornados
		.then(function(enderecoRetornado) {

			//Exclui o objeto retornado
			enderecoRetornado.destroy({transaction : t})

			//Retorna o objeto usuário vinculado ao porteiro
			return dataContext.Usuario.findById(porteiroRetornado.usuarioId, {transaction : t})

			//Chama uma promise passando como parâmetro os dados retornados da pessoa vínculada
		}).then(function(usuario) {

			//Exclui o usuário vinculado ao porteiro
			return usuario.destroy({transaction : t})

			//Chama uma promise que retorna os dados em formato JSON
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
			msg: "Falha ao excluir o porteiro" 
		});	
	})
}

function atualizaPorteiro(req,res){
	
	if (!req.params.id) {
		res.status(409).json({
			sucesso: false,
			msg: "Formato de entrada inválido."
		})
		return;
	}

	//Variável que recebe os dados vindos do formulário
	let porteiroForm = req.body.porteiro;

	//Verifica se os dados estão preenchidos de forma correta
	if (!porteiroForm) {
		res.status(404).json({
			sucesso: false,
			msg: "Formato de entrada inválido."
		})
		return;
	}

	//Iniciando transaction
	dataContext.conexao.transaction(function(t) {

		//Variável para receber os dados retornados para serem usados fora das suas respectivas funções
		let dadosPorteiro

		//Pesquisa o porteiro pelo id passado como parâmetro na URL
		return dataContext.Porteiro.findById(req.params.id, {transaction : t})
		
		//Chama uma promise passando como parâmetro o porteiro retornado
		.then(function(porteiroRetornado){

			//Verifica se retornou algo
			if (!porteiroRetornado) {
				res.status(404).json({
					sucesso: false,
					msg: "Porteiro não encontrado."
				})
				return;
			}

			//Atribui a uma variável os dados retornados
			dadosPorteiro = porteiroRetornado

			//Pesquisa a pessoa vinculada ao porteiro
			return dataContext.Pessoa.findById(porteiroRetornado.pessoaId, {transaction : t})
		})
		
		//Chama uma promise passando como parâmetro os dados da pessoa vinculada
		.then(function(pessoaRetornada){

			let updateFields = {
				nome 						: porteiroForm.pessoa.nome,
				nascimento 					: porteiroForm.pessoa.nascimento,
				cpf 						: porteiroForm.pessoa.cpf
			}

			//Atualiza os dados da pessoa vinculada
			pessoaRetornada.update(updateFields, {transaction : t})

			//Pesquisa o endereço vinculado ao porteiro
			return dataContext.Endereco.findById(pessoaRetornada.enderecoId, {transaction : t})
		})

		//Chama uma promise passando como parâmetro os dados do endereço vinculado
		.then(function(enderecoRetornado) {

			let updateFields = {
				logradouro 			: porteiroForm.endereco.logradouro,
				numero 				: porteiroForm.endereco.numero,
				bairro 				: porteiroForm.endereco.bairro,
				cidade 				: porteiroForm.endereco.cidade,
				uf 					: porteiroForm.endereco.uf
			}

			//Atualiza os dados do endereço vinculado
			enderecoRetornado.update(updateFields, {transaction : t})

			//Pesquisa no banco de dados o usuário vinculado ao porteiro
			return dataContext.Usuario.findById(dadosPorteiro.usuarioId, {transaction : t})
		})

		//Cria uma promise passando como parâmetro os dados retornados da pesquisa
		.then(function(usuarioRetornado) {

			//Campos que do usuário que serão atualizados
			let updateFields = {
				email	:	porteiroForm.usuario.email,
				senha	:	porteiroForm.usuario.senha
			}

			//Atualiza os campos do usuário
			return usuarioRetornado.update(updateFields, {transaction : t})
		})
	})

	//Chama uma promise que retona os dados e o JSON
	.then(function(porteiroAtualizado){
			res.status(200).json({
        		sucesso:true,
        		msg: "Registro atualizado com sucesso",
        		data: porteiroAtualizado
        	})	
		})

		//Caso haja uma exceção
		.catch(function(erro){
			console.log(erro);
			res.status(409).json({ 
				sucesso: false,
				msg: "Falha ao atualizar o porteiro" 
			});	
		})
}

module.exports = {
	//Quando for consumir irá pegar os nomes da primeira tabela
    carregaTudo  	: carregaTudo,
    carregaPorId 	: carregaPorId,
    salva 			: salvaPorteiro,
    exclui 			: excluiPorteiro,
    atualiza 		: atualizaPorteiro   
}