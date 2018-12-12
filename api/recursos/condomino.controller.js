//Require quero o arquivo
const dataContext = require('../dao/dao'),
      util        = require('../util/util');	

//Orem influência o nome mão
//Primeiro requisição
function carregaTudo(req,res) {

	if (req.query.search) {
    
		return dataContext.Condomino.findAll({
			include : [
				{
					model : dataContext.Usuario,
					//attributes: { exclude: ['senha'] },
					
				},
				{
					model : dataContext.Pessoa,
					attributes: { exclude: ['endereco_id'] },
					where: {
						nome: {
							$like: '%'+req.query.search+'%'
						}
					},

					//Inclue o endereço associado a Pessoa
					include : {

						model : dataContext.Endereco,
					}
				},
			]
		}).then(function(condominos){

			condominos = condominos.map(function(condominoRetornado) {
				condominoRetornado = condominoRetornado.get({plain : true})

				delete condominoRetornado.pessoa_id
				delete condominoRetornado.usuario_id

				return condominoRetornado
			})
			res.status(200).json({
				sucesso:true,
				data: condominos
			})
		})
	}

	return dataContext.Condomino.findAll({
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
	}).then(function(condominos){

		condominos = condominos.map(function(condominoRetornado) {
			condominoRetornado = condominoRetornado.get({plain : true})

			delete condominoRetornado.pessoa_id
			delete condominoRetornado.usuario_id

			return condominoRetornado
		})
		res.status(200).json({
			sucesso:true,
			data: condominos
		})
	})
	
}    

function carregaPorId(req,res) {

    //req.param.id porque passei na URL
    return dataContext.Condomino.findById(req.params.id,{
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
		    
    }).then(function(condomino){

        if (!condomino) {
			res.status(404).json({
				sucesso: false,
				msg: "Condomino não encontrado."
			})
			return;
		}
		
        condomino = condomino.get({plain : true})

        delete condomino.pessoa_id;
        delete condomino.usuario_id;

        /*
        condomino = {...condomino.usuario, ...condomino.pessoa, ...condomino}
        delete condomino.pessoa;
        delete condomino.usuario;
        */

        //Por padrão retorna o status
        res.status(200).json({
			sucesso: true,
			data: condomino
		})
    })


} 

function salvaCondomino(req,res){
	//req.body campos do body
	//Mesma coisa que [FromBody] no C#
	let condomino = req.body.condomino,
	//Variável com os campos do usuário
        usuario = {
            email : condomino.usuario.email,
            senha : condomino.usuario.senha,
            tipo  : 2,
            desativado : false,
            criacao : new Date()
		},
		//Váriavel com os campos da pessoa
        pessoa = {
            nome                : condomino.pessoa.nome,
            cpf                 : condomino.pessoa.cpf,
            nascimento          : condomino.pessoa.nascimento,
            digital             : util.criaDigital(),
            criacao             : new Date()
		},
		//Variável com os campos do endereço
		endereco = {
			logradouro  : condomino.endereco.logradouro,
            numero      : condomino.endereco.numero,
            bairro      : condomino.endereco.bairro,
            cidade      : condomino.endereco.cidade,
            uf          : condomino.endereco.uf,
		}

	if (!condomino) {
		res.status(404).json({
			sucesso: false, 
			msg: "Formato de entrada inválido."
		})
		return;
	}    
	
	//Inicia Transação
	dataContext.conexao.transaction(function(t) {
		//variavel para receber o usuario criado devido ao "Clojure"
		let dadosUsuarioCriado;

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
		.then(function(enderecoCriado){

			//Atribui ao campo enderecoId da variável pessoa o id passado como parâmetro desta função
			pessoa.enderecoId = enderecoCriado.id

			//Cria um objeto pessoa no banco de dados
			return dataContext.Pessoa.create(pessoa, {transaction : t})
		})
		
		//Cria uma promise passando como parâmetro o objeto criado
		.then(function(novaPessoa){

			//Cria um objeto condomino no banco de dados
			return dataContext.Condomino.create({
				usuarioId 			: dadosUsuarioCriado.id,
				pessoaId  			: novaPessoa.id, 
				enderecoCondomino  	: condomino.enderecoCondomino
			}, {transaction : t})
		})
	})

	//Commit
    .then(function(resultado) {    
        res.status(201).json({
            sucesso : true,
            data : resultado
        })
    })
    .catch(function(erro){
        console.log(erro)
        res.status(409).json({ 
            sucesso: false,
            msg: "Falha ao incluir o condomino" 
        })
    })
}

function excluiCondomino(req,res){
	
	//Verifica se os dados passados no formulário estão peenchidos de forma correta
	if (!req.params.id) {
		res.status(409).json({
			sucesso: false,
			msg: "Formato de entrada inválido."
		})
		return;
	}

	//Variável para receber os dados antes de serem exluidos
	let dadosCondomino
	let dadosPessoa

	//Iniciando transaction
	dataContext.conexao.transaction(function(t) {

		//Pesquisa no banco de dados o condomino com o id passado como parâmetro via URL
		return dataContext.Condomino.findById(req.params.id, {transaction : t})
		
		//Chama uma promise com os dados retornados da pesquisa
		.then(function(condominoRetornado){
			
			//Verifica se retornou algo
			if (!condominoRetornado) {
				res.status(404).json({
					sucesso: false,
					msg: "Condomino não encontrado."
				})
				return;
			}
	
			//Atribui os dados antes de excluir o objeto
			dadosCondomino = condominoRetornado;

			//exclui somente os dados de condomino
			condominoRetornado.destroy({transaction : t})

			//Pesquisa no banco dedaos o usuario associado ao condomino
			return dataContext.Usuario.findById(dadosCondomino.usuarioId, {transaction : t})
		})

		//Chama uma promise e passa como parâmetro os dados da pesquisa
		.then(function(usuarioRetornado) {
			//Exclui o usuário retornado
			usuarioRetornado.destroy({transaction : t})

			//Pesquisa no banco de dados a pessoa associada ao condomino
			return dataContext.Pessoa.findById(dadosCondomino.pessoaId, {transaction : t})
		})

		//Cria uma promise e passa como parâmetro os dados da pesquisa
		.then(function(pessoaRetornada) {

			//Atribui os dados da pessoa retornada antes de ser excluida
			dadosPessoa = pessoaRetornada

			//Exclui a pessoa vinculada
			pessoaRetornada.destroy({transaction : t})

			//Pesquisa no banco de dados o endereço vinculado ao condomino
			return dataContext.Endereco.findById(dadosPessoa.enderecoId,{transaction : t})
		})

		//Cria uma promise passando como parâmetro os dados da pesquisa
		.then(function(enderecoRetornado) {

			//Exclui o endereço vinculado
			return enderecoRetornado.destroy({transaction : t})
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
			msg: "Falha ao excluir o Condomino" 
		});	
	})
}

function atualizaCondomino(req,res){
	
	//Verifica se o dado passado na URL é integro
	if (!req.params.id) {
		res.status(409).json({
			sucesso: false,
			msg: "Formato de entrada inválido."
		})
		return;
	}

	//Variável que recebe os dados recebidos do formulário
	let condominoForm = req.body.condomino;

	//Verifica se os dados preenchidos no formulário estão integros
	if (!condominoForm) {
		res.status(404).json({
			sucesso: false,
			msg: "Formato de entrada inválido."
		})
		return;
	}

	//Inicia transaction
	dataContext.conexao.transaction(function(t) {

		//Variável que recebe os dados retornados para serem usados fora das respectivas funcões
		let dadosCondomino

		//Pesquisa no banco de dados o condomino com o id associado ao id passado na URL
		return dataContext.Condomino.findById(req.params.id, {transaction : t})
		
		//Cria uma promise passando como parâmetro os dados da pesquisa
		.then(function(condominoRetornado){
			
			//Verifica se retornou algo
			if (!condominoRetornado) {
				res.status(404).json({
					sucesso: false,
					msg: "Condomino não encontrada."
				})
				return;
			}

			let updateFields = {
				enderecoCondomino	:	condominoForm.enderecoCondomino
			}

			//Atualiza os dados do condomino
			condominoRetornado.update(updateFields, {transaction : t})

			//Atribui os dados atualizados a uma variável
			dadosCondomino = condominoRetornado

			//Pesquisa no banco de dados a pessoa associada ao condomino
			return dataContext.Pessoa.findById(condominoRetornado.pessoaId, {transaction : t})
		})
		
		//Cria uma promise passando como parâmetro os dados da pesquisa
		.then(function(pessoaRetornada){

			//Atributos de pessoa que serão atualizados
			let updateFields = {
				nome 						: condominoForm.pessoa.nome,
				nascimento 					: condominoForm.pessoa.nascimento
			}

			//Atualiza os campos do objeto pessoa
			pessoaRetornada.update(updateFields, {transaction : t})

			//Pesquisa na banco de dados o endereço associado à pessoa
			return dataContext.Endereco.findById(pessoaRetornada.enderecoId, {transaction : t})
		})

		//Cria uma promise passando como parâmetro os dados da pesquisa
		.then(function(enderecoRetornado) {

			//Atributos do endereço que serão atualizados
			let updateFields = {
				logradouro 		: condominoForm.endereco.logradouro,
				numero 			: condominoForm.endereco.numero,
				bairro 			: condominoForm.endereco.bairro,
				cidade 			: condominoForm.endereco.cidade,
				uf 				: condominoForm.endereco.uf,
			}

			//Atualiza os dados do objeto endereço
			enderecoRetornado.update(updateFields, {transaction : t})

			//Pesquisa no banco de dados o usuário associado ao condomino
			return dataContext.Usuario.findById(dadosCondomino.usuarioId, {transaction : t})
		})

		//Cria uma promise passando como parâmetro os dados da pesquisa
		.then(function(usuarioRetornado) {

			//Atributos do usuário que serão alterados
			let updateFields = {
				email	:	condominoForm.usuario.email,
				senha	: 	condominoForm.usuario.senha
			}

			//Atualiza so dadso do objeto usuário
			return usuarioRetornado.update(updateFields, {transaction : t})
		})
	})
	
	//Commit
	.then(function(condominoAtualizado){
		res.status(200).json({
			sucesso:true,
			msg: "Registro atualizado com sucesso",
			data: condominoAtualizado
		})	
	})
	//Roolback
	.catch(function(erro){
		console.log(erro);
		res.status(409).json({ 
			sucesso: false,
			msg: "Falha ao atualizar o condomino" 
		});	
	})
}

module.exports = {
	//Quando for consumir irá pegar os nomes da primeira tabela
    carregaTudo  	: carregaTudo,
    carregaPorId 	: carregaPorId,
    salva 			: salvaCondomino,
    exclui 			: excluiCondomino,
    atualiza 		: atualizaCondomino   
}