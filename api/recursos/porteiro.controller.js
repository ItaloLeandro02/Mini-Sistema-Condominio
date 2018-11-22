//Require quero o arquivo
const dataContext = require('../dao/dao'),
      util        = require('../util/util');	

//Orem influência o nome mão
//Primeiro requisição
function carregaTudo(req,res) {
    
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
				attributes: { exclude: ['senha'] },
				
				//Retorna todos os atributos menos estes
                attributes : ['email','desativado']
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
    
    //variavel para receber o usuario criado devido ao "Clojure"
    let dadosUsuarioCriado

	//Cria um objeto usuario no banco de dados
	dataContext.Usuario.create(usuario)
	
	//Cria uma promise passando como parâmetro o objeto criado 
    .then(function(novoUsuario){
		
		//Atribui o objeto passado como parâmetro para ser usado na criação do porteiro
		dadosUsuarioCriado = novoUsuario;
		
		//Cria um objeto endereco no banco de dados
        return dataContext.Endereco.create(endereco)
	})

	//Cria uma promise passando como parâmetro o objeto criado
	.then(function(enderecoCriado) {

		//Atribuia ao campo endereco_id o valor do id do endereco criado
		pessoa.enderecoId = enderecoCriado.id
		//Cria um objeto pessoa no banco de dados
		return dataContext.Pessoa.create(pessoa)
	})
	
	//Cria uma promise passando como parâmetro o objeto criado
    .then(function(novaPessoa){

		//Cria un objeto porteiro no banco de dados
        return dataContext.Porteiro.create({
            usuarioId : dadosUsuarioCriado.id,
            pessoaId  : novaPessoa.id 
        })
	})
	
	//Cria uma promise que retorna o JSON
    .then(function(novoPorteiro){
        
        res.status(201).json({
            sucesso : true,
            data : porteiro
        })
	})
	
	//Caso haja uma exceção
    .catch(function(e){
        console.log(e)
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

	//Procura o porteiro pelo id passado pela URL
	dataContext.Porteiro.findById(req.params.id).then(function(porteiro) {
		
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
		porteiro.destroy()

		//Retorna o objeto pessoa vinculado ao porteiro
		return dataContext.Pessoa.findById(porteiroRetornado.pessoaId)

		//Chama uma promise passando como parâmetro os dados retornados da pessoa vínculada
	}).then(function(pessoa) {

		//Atribui os dados da pessoa encontrada pare serem usados fora da função
		pessoaRetornada = pessoa

		//Exclui a pessoa vinculada
		pessoa.destroy()

		//Retorna o objeto endereço vinculado ao porteiro
		return dataContext.Endereco.findById(pessoaRetornada.enderecoId)
	})
	
	//Cria uma promise passando como parâmetro os dados retornados
	.then(function(enderecoRetornado) {

		//Exclui o objeto retornado
		enderecoRetornado.destroy()

		//Retorna o objeto usuário vinculado ao porteiro
		return dataContext.Usuario.findById(porteiroRetornado.usuarioId)

		//Chama uma promise passando como parâmetro os dados retornados da pessoa vínculada
	}).then(function(usuario) {

		//Exclui o usuário vinculado ao porteiro
		usuario.destroy()

		//Chama uma promise que retorna os dados em formato JSON
	}).then(function(){
			res.status(200).json({
        		sucesso:true,
        		msg: "Registro excluído com sucesso",
        		data: []
        	})	        	
		})

		//Caso hja um erro durante a operação 
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

	//Variável para receber os dados retornados para serem usados fora das suas respectivas funções
	let dadosPorteiro

	//Pesquisa o porteiro pelo id passado como parâmetro na URL
	dataContext.Porteiro.findById(req.params.id)
	
	//Chama uma promise passando como parâmetro o porteiro retornado
	.then(function(porteiroRetornado){

		//Verifica se retornou algo
		if (!porteiroRetornado) {
			res.status(404).json({
				sucesso: false,
				msg: "Porteiro não encontrada."
			})
			return;
		}

		//Atribui a uma variável os dados retornados
		dadosPorteiro = porteiroRetornado

		//Pesquisa a pessoa vinculada ao porteiro
		return dataContext.Pessoa.findById(porteiroRetornado.pessoaId)
	})
	
	//Chama uma promise passando como parâmetro os dados da pessoa vinculada
	.then(function(pessoaRetornada){

		let updateFields = {
			nome 						: porteiroForm.pessoa.nome,
			nascimento 					: porteiroForm.pessoa.nascimento,
		}

		//Atualiza os dados da pessoa vinculada
		pessoaRetornada.update(updateFields)

		//Pesquisa o endereço vinculado ao porteiro
		return dataContext.Endereco.findById(pessoaRetornada.enderecoId)
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
		enderecoRetornado.update(updateFields)

		//Pesquisa no banco de dados o usuário vinculado ao porteiro
		return dataContext.Usuario.findById(dadosPorteiro.usuarioId)
	})

	//Cria uma promise passando como parâmetro os dados retornados da pesquisa
	.then(function(usuarioRetornado) {

		//Campos que do usuário que serão atualizados
		let updateFields = {
			email	:	porteiroForm.usuario.email,
			senha	:	porteiroForm.usuario.senha
		}

		//Atualiza os campos do usuário
		usuarioRetornado.update(updateFields)
	})

	//Chama uma promise que retona os dados e o JSON
	.then(function(porteiroAtualizado){
			res.status(200).json({
        		sucesso:true,
        		msg: "Registro atualizado com sucesso",
        		data: dadosPorteiro
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