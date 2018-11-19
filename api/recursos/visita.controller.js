//Require quero o arquivo
const dataContext = require('../dao/dao'),
      util        = require('../util/util');	

//Orem influência o nome mão
//Primeiro requisição
function carregaTudo(req,res) {
    
    return dataContext.Visita.findAll({
		//Procura a Primary Key
    	order : 'id'
    }).then(function(visitas){
        res.status(200).json({
        	sucesso:true,
        	data: visitas
        })
    })
}    

function carregaPorId(req,res) {

    //req.param.id porque passei na URL
    return dataContext.Visita.findById(req.params.id,{
        include : [
            {
				model : dataContext.Usuario,
				
				//Retorna todos os atributos menos estes
                attributes : ['email','desativado']
            },
            {
                model : dataContext.Pessoa,

                //Retorna todos os atributos menos estes
                attributes: { exclude: ['id', 'enderecoId', 'endereco_id'] }
			},
			{
				model: dataContext.Endereco,
				
				//Retorna todos os atributos do objeto endereço, menos o id
				attributes: { exclude: ['id'] }
            },
            {
				model: dataContext.Condomino,
				
				//Retorna todos os atributos do objeto endereço, menos o id
				attributes: { exclude: ['id', 'pessoaId', 'usuarioId'] }
            },
            {
				model: dataContext.Porteiro,
				
				//Retorna todos os atributos do objeto endereço, menos o id
				attributes: { exclude: ['id', 'pessoaId', 'usuarioId'] }
            },
		]
		    
    })
    
    //Cria uma promise e passa como parâmetro o objeto visita pesquisado
    .then(function(visita){

        //Verifica se retornou algo
        if (!visita) {
			res.status(404).json({
				sucesso: false,
				msg: "Visita não encontrada."
			})
			return;
		}
		
        visita = visita.get({plain : true})

        //Exclue estes registros da view, mas os mantém no banco de dadso
        delete visita.pessoa_id;
        delete visita.usuario_id;
        delete visita.condomino_id;
        delete visita.endereco_id;

        /*
        visita = {...visita.usuario, ...visita.pessoa, ...visita}
        delete visita.pessoa;
        delete portvisitaeiro.usuario;
        */

        //Retorna os objetos e o JSON
            res.status(200).json({
			sucesso: true,
			data: visita
		})
    })
} 

function salvaVisita(req,res){
    
    //Cria uma variável que recebe os dados vindos do formulário
    let visita = req.body.visita,

	if (!visita) {
		res.status(404).json({
			sucesso: false, 
			msg: "Formato de entrada inválido."
		})
		return;
	}    
    
    //Define alguns valores padrões parâmetros 
    visita.criacao = new Date()

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