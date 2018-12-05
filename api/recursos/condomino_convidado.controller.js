//Require quero o arquivo
const dataContext = require('../dao/dao'),
      util        = require('../util/util');	

//Ordem influência o nome mão
//Primeiro requisição
function carregaTudo(req,res) {

	//Caso busque pelo nome do convidado
	if (req.query.condomino && req.query.convidado) {

    return dataContext.Condomino_Convidado.findAll({
		include : [
            {
				model : dataContext.Condomino,
				//attributes: { exclude: ['senha'] },
            },
            {
				model : dataContext.Pessoa,
				attributes: { exclude: ['endereco_id'] },
				where : {
					nome: {
						$like : '%'+req.query.convidado+'%'
					}
				}
			},
		],
		where :{
			condominoId : Number(req.query.condomino)
		},
    }).then(function(convidados){

		convidados = convidados.map(function(convidadosRetornados) {
			convidadosRetornados = convidadosRetornados.get({plain : true})

			delete convidadosRetornados.pessoa_id
			delete convidadosRetornados.condomino_id
			delete convidadosRetornados.condomino;

			return convidadosRetornados
		})
        res.status(200).json({
        	sucesso:true,
        	data: convidados
        })
	})
	}

	//Para retornar todos os convidados
	if (req.query.condomino) {

		return dataContext.Condomino_Convidado.findAll({
			include : [
				{
					model : dataContext.Condomino,
					//attributes: { exclude: ['senha'] },
				},
				{
					model : dataContext.Pessoa,
					attributes: { exclude: ['endereco_id'] },
				},
			],
			where :{
				condominoId : Number(req.query.condomino)
			},
		}).then(function(convidados){
	
			convidados = convidados.map(function(convidadosRetornados) {
				convidadosRetornados = convidadosRetornados.get({plain : true})
	
				delete convidadosRetornados.pessoa_id
				delete convidadosRetornados.condomino_id
				delete convidadosRetornados.condomino;
	
				return convidadosRetornados
			})
			res.status(200).json({
				sucesso:true,
				data: convidados
			})
		})
	}

	//Para retornar todos para os testes
	return dataContext.Condomino_Convidado.findAll({
		include : [
            {
				model : dataContext.Condomino,
				//attributes: { exclude: ['senha'] },
				
            },
            {
				model : dataContext.Pessoa,
				attributes: { exclude: ['endereco_id'] },
			},
		]
    }).then(function(convidados){

		convidados = convidados.map(function(convidadosRetornados) {
			convidadosRetornados = convidadosRetornados.get({plain : true})

			delete convidadosRetornados.pessoa_id
			delete convidadosRetornados.condomino_id
			delete convidadosRetornados.condomino;

			return convidadosRetornados
		})
        res.status(200).json({
        	sucesso:true,
        	data: convidados
        })
	})
	
}    

function carregaPorId(req,res) {

    //req.param.id porque passei na URL
    return dataContext.Condomino_Convidado.findById(req.params.id,{
        include : [
            {
				model : dataContext.Condomino,
				attributes: { exclude: ['senha'] },
				
            },
            {
				model : dataContext.Pessoa,
				attributes: { exclude: ['endereco_id'] },
			},
		]
		    
    }).then(function(convidado){

        if (!convidado) {
			res.status(404).json({
				sucesso: false,
				msg: "Pessoas não encontradas."
			})
			return;
		}
		
        convidado = convidado.get({plain : true})

        delete convidado.pessoa_id;
		delete convidado.condomino_id;
		delete convidado.condomino;

        res.status(200).json({
			sucesso: true,
			data: convidado
		})
    })

} 

function salvaConvidado(req,res){
	//req.body campos do body
	//Mesma coisa que [FromBody] no C#
	let convidado = req.body.convidado;

	if (!convidado) {
		res.status(404).json({
			sucesso: false, 
			msg: "Formato de entrada inválido."
		})
		return;
	}    

	convidado.favorito	= false;
	
	//Cria un objeto porteiro no banco de dados
	dataContext.Condomino_Convidado.create(convidado)

	//Cria uma promise que retorna o JSON
    .then(function(novoConvidado){
        
        res.status(201).json({
            sucesso : true,
            data : novoConvidado
        })
	})
	
	//Caso haja uma exceção
    .catch(function(e){
        console.log(e)
        res.status(409).json({ 
            sucesso: false,
            msg: "Falha ao incluir o convidado" 
        })
    })
}

function excluiConvidado(req,res){

	//Verifica se o parâmetro passado é o parâmetro id
	if (!req.params.id) {
		res.status(409).json({
			sucesso: false,
			msg: "Formato de entrada inválido."
		})
		return;
	}

	//Pesquisa no banco de dados o usuário correspondente ao id passado como parâmetro via URL
	dataContext.Condomino_Convidado.findById(req.params.id)
	
	//Cria uma promise passando como parâmetro os dados retornados da pesquisa 
	.then(function(convidadoRetornado){
		
		//Verifica se retornou algo
		if (!convidadoRetornado) {
			res.status(404).json({
				sucesso: false,
				msg: "Convidado não encontrado."
			})
			return;
		}

		//Exclui o usuário retornado
		convidadoRetornado.destroy()

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
				msg: "Falha ao excluir o convidado" 
			});	
		})
    })
}

function atualizaConvidado(req,res){
	
	//Verifica se o parâmetro passado via URL é um id
	if (!req.params.id) {
		res.status(409).json({
			sucesso: false,
			msg: "Formato de entrada inválido."
		})
		return;
	}

	//Variável que recebe os dados vindos do formulário
	let convidadoForm = req.body.convidado;

	//Verifica se retornou algo
	if (!convidadoForm) {
		res.status(404).json({
			sucesso: false,
			msg: "Formato de entrada inválido."
		})
		return;
	}

	//Pesquisa no banco de dados o usuário corresponde ao id passado como parâmetro via URL
	dataContext.Condomino_Convidado.findById(req.params.id)
	
	//Cria uma promise passando como parâmetro os dados da pesquisa
	.then(function(convidadoRetornado){
		
		//Verifica se retornou algo
		if (!convidadoRetornado) {
			res.status(404).json({
				sucesso: false,
				msg: "Convidado não encontrado."
			})
			return;
		}
		
		//Campos do usuário que serão atualizados
		let updateFields = {
			favorito	:	convidadoForm.favorito
		}

		//Atualiza os campos do usuário
		convidadoRetornado.update(updateFields)

		//Cria uma promise que recebe como parâmetro o objeto usuário com os dados atualizados
		.then(function(condominoAtualizado){
			res.status(200).json({
        		sucesso:true,
        		msg: "Registro atualizado com sucesso",
        		data: condominoAtualizado
        	})	
		})

		//Caso haja uma exceção
		.catch(function(erro){
			console.log(erro);
			res.status(409).json({ 
				sucesso: false,
				msg: "Falha ao atualizar o convidado" 
			});	
		})
	})
}

module.exports = {
	//Quando for consumir irá pegar os nomes da primeira tabela
    carregaTudo  	: carregaTudo,
    carregaPorId 	: carregaPorId,
    salva 			: salvaConvidado,
	exclui 			: excluiConvidado,
	atualiza 		: atualizaConvidado
}