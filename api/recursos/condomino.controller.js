//Require quero o arquivo
const dataContext = require('../dao/dao'),
      util        = require('../util/util');	

//Orem influência o nome mão
//Primeiro requisição
function carregaTudo(req,res) {
    
    return dataContext.Condomino.findAll({
		//Procura a Primary Key
    	order : 'id'
    }).then(function(condominos){
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
                model       : dataContext.Usuario,
                attributes : ['email','desativado']
            },
            {
                model : dataContext.Pessoa
			},
			{
				model: dataContext.Endereco,
				
				//Retorna todos os atributos do objeto endereço, menos o id
				attributes: { exclude: ['id'] }
			}
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
			logradouro  : porteiro.endereco.lgradouro,
            numero      : porteiro.endereco.numero,
            bairro      : porteiro.endereco.bairro,
            cidade      : porteiro.endereco.cidade,
            uf          : porteiro.endereco.uf,
		}

	if (!condomino) {
		res.status(404).json({
			sucesso: false, 
			msg: "Formato de entrada inválido."
		})
		return;
	}    
    
    //variavel para receber o usuario criado devido ao "Clojure"
    let dadosUsuarioCriado;

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
    .then(function(enderecoCriado){

		//Atribui ao campo enderecoId da variável pessoa o id passado como parâmetro desta função
		pessoa.enderecoId = enderecoCriado.id

		//Cria um objeto pessoa no banco de dados
        return dataContext.Pessoa.create(pessoa)
	})
	
	//Cria uma promise passando como parâmetro o objeto criado
    .then(function(novaPessoa){

		//Cria um objeto condomino no banco de dados
		return dataContext.Condomino.create({
			usuarioId : dadosUsuarioCriado.id,
            pessoaId  : novaPessoa.id, 
            endereco  : condomino.enderecoCondomino
		})
	})

	//Cria uma promise passando como parâmetro o objeto criado
    .then(function(condomino) {    
        res.status(201).json({
            sucesso : true,
            data : condomino
        })
    })
    .catch(function(e){
        console.log(e)
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

	//Pesquisa no banco de dados o condomino com o id passado como parâmetro via URL
	dataContext.Condomino.findById(req.params.id)
	
	//Chama uma promise com os dados retornados da pesquisa
	.then(function(condomino){
		
		//Verifica se retornou algo
		if (!condomino) {
			res.status(404).json({
				sucesso: false,
				msg: "Condomino não encontrado."
			})
			return;
		}
		//exclui somente os dados de condomino
		condomino.destroy()

		//Pesquisa no banco dedaos o usuario associado ao condomino
		return dataContext.Usuario.findById(dadosCondomino.usuarioId)
	})

	//Chama uma promise e passa como parâmetro os dados da pesquisa
	.then(function(usuarioRetornado) {

		//Exclui o usuário retornado
		usuarioRetornado.destroy()

		//Pesquisa no banco de dados a pessoa associada ao condomino
		return dataContext.Pessoa.findById(dadosCondomino.pessoaId)
	})

	//Cria uma promise e passa como parâmetro os dados da pesquisa
	.then(function(pessoaRetornada) {

		//Atribui os dados da pessoa retornada antes de ser excluida
		dadosPessoa = pessoaRetornada

		//Exclui a pessoa vinculada
		pessoaRetornada.destroy()

		//Pesquisa no banco de dados o endereço vinculado ao condomino
		return dataContext.Endereco.findById(pessoaRetornada.enderecoId)
	})

	//Cria uma promise passando como parâmetro os dados da pesquisa
	.then(function(enderecoRetornado) {

		//Exclui o endereço vinculado
		enderecoRetornado.destroy()
	})

		//Caso a exclusão seja um sucesso
		.then(function(){
			res.status(200).json({
        		sucesso:true,
        		msg: "Registro excluído com sucesso",
        		data: []
        	})	        	
		})

		//Caso haja uma exceção
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

	//Variável que recebe os dados retornados para serem usados fora das respectivas funcões
	let dadosCondomino
	let dadosPessoa

	//Pesquisa no banco de dados o condomino com o id associado ao id passado na URL
	dataContext.Condomino.findById(req.params.id)
	
	//Cria uma promise passando como parâmetro os dados da pesquisa
	.then(function(condominoRetornado){
		
		//Verifica se retornou algo
		if (!condomino) {
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
		condominoRetornado.update(updateFields)

		//Atribui os dados atualizados a uma variável
		dadosCondomino = condominoRetornado

		//Pesquisa no banco de dados a pessoa associada ao condomino
		return dataContext.Pessoa.findById(condominoRetornado.pessoaId)
	})
	
	//Cria uma promise passando como parâmetro os dados da pesquisa
	.then(function(pessoaRetornada){

		//Atributos de pessoa que serão atualizados
		let updateFields = {
			nome 						: condominoForm.pessoa.nome,
			nascimento 					: condominoForm.pessoa.nascimento
		}

		//Atualiza os campos do objeto pessoa
		pessoaRetornada.update(updateFields)

		//Pesquisa na banco de dados o endereço associado à pessoa
		return dataContext.Endereco.findById(pessoaRetornada.enderecoId)
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
		enderecoRetornado.update(updateFields)

		//Pesquisa no banco de dados o usuário associado ao condomino
		return dataContext.Usuario.findById(dadosCondomino.usuarioId)
	})

	//Cria uma promise passando como parâmetro os dados da pesquisa
	.then(function(usuarioRetornado) {

		//Atributos do usuário que serão alterados
		let updateFields = {
			email	:	condominoForm.usuario.email,
			senha	: 	condominoForm.usuario.senha
		}

		//Atualiza so dadso do objeto usuário
		usuarioRetornado.update(updateFields)
	})
	
	//Cria uma promise passando como parâmetro os dados retornados
	.then(function(condominoAtualizado){
			res.status(200).json({
        		sucesso:true,
        		msg: "Registro atualizado com sucesso",
        		data: dadosCondomino
        	})	
		})

		//Caso haja uma exceção
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