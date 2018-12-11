//Require quero o arquivo
const dataContext = require('../dao/dao');

//Orem influência o nome mão
//Primeiro requisição
function carregaTudo(req,res) {
	
	if (req.query.condomino) {

    return dataContext.Visita.findAll({
		where :{
			condominoId : req.query.condomino
		},
		
		//Procura a Primary Key
    	order : 'id'
    }).then(function(visitas){

		visitas = visitas.map(function(visitasRetornadas) {
			visitasRetornadas = visitasRetornadas.get({plain : true})

			delete visitasRetornadas.pessoa_id
			delete visitasRetornadas.usuario_id
			delete visitasRetornadas.condomino_id
			delete visitasRetornadas.condomino_id
			delete visitasRetornadas.porteiro_id

			return visitasRetornadas
		})
		//Percorre o array retirando os dados desnecessários
        res.status(200).json({
        	sucesso:true,
        	data: visitas
        })
	})

	}

	if (req.query.condominoVisitas) {

		return dataContext.Visita.findAll({
			include : [
				{
				model : dataContext.Condomino,
					include: {
						model : dataContext.Pessoa,
						where: {
							nome:{
								$like: '%'+req.query.condominoVisitas+'%'
							}
						}
					}
				}
			]
		}).then(function(visitas){
	
			visitas = visitas.map(function(visitasRetornadas) {
				visitasRetornadas = visitasRetornadas.get({plain : true})
	
				delete visitasRetornadas.pessoa_id
				delete visitasRetornadas.usuario_id
				delete visitasRetornadas.condomino_id
				delete visitasRetornadas.condomino_id
				delete visitasRetornadas.porteiro_id
	
				return visitasRetornadas
			})
			//Percorre o array retirando os dados desnecessários
			res.status(200).json({
				sucesso:true,
				data: visitas
			})
		})
	
		}

	return dataContext.Visita.findAll({
		
		include : [
			{
			model : dataContext.Condomino,
				include: {
					model : dataContext.Pessoa,
				}
			}
		]
		
    }).then(function(visitas){

		visitas = visitas.map(function(visitasRetornadas) {
			visitasRetornadas = visitasRetornadas.get({plain : true})

			delete visitasRetornadas.pessoa_id
			delete visitasRetornadas.usuario_id
			delete visitasRetornadas.condomino_id
			delete visitasRetornadas.condomino_id
			delete visitasRetornadas.porteiro_id

			return visitasRetornadas
		})
		//Percorre o array retirando os dados desnecessários
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
                model : dataContext.Pessoa,
				 	include : {

						model : dataContext.Endereco,
				 	}
			},
            {
				model: dataContext.Condomino,
                    include : {

                        model : dataContext.Pessoa, 
                        attributes: { exclude: ['enderecoId'] },
                    },
            },
            {
				model: dataContext.Porteiro,
                    include : {
                        model : dataContext.Pessoa, 
                 }
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

        //Exclue estes registros da view, mas os mantém no banco de dados
        delete visita.pessoa_id;
        delete visita.usuario_id;
        delete visita.condomino_id;
        delete visita.endereco_id;
        delete visita.porteiro_id;

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
    let visita = req.body.visita

	if (!visita) {
		res.status(404).json({
			sucesso: false, 
			msg: "Formato de entrada inválido."
		})
		return;
    }
    
	
	//Define algusn padrões
	visita.situacao 					= 1
	visita.dataHoraReserva				= new Date(visita.dataHoraReserva)
	visita.dataHoraExpiracao			= new Date(visita.dataHoraReserva)
    visita.dataHoraExpiracao.setHours(visita.dataHoraReserva.getHours() + 4)
	visita.portariaDataHoraChegada		= null
	visita.portariaObservacao			= null
	
    
	//Criar um novo objeto Visita no banco de dados com os dados passados pelo formulário
	dataContext.Visita.create(visita)

	//Cria uma promise que retorna o JSON
    .then(function(novaVisita){
        
        res.status(201).json({
            sucesso : true,
            data : novaVisita
        })
	})
	
	//Caso haja uma exceção
    .catch(function(e){
        console.log(e)
        res.status(409).json({ 
            sucesso: false,
            msg: "Falha ao incluir a visita" 
        })
    })
}

function excluiVisita(req,res){

	//Verifica se os dados passados no formulário estão peenchidos de forma correta
	if (!req.params.id) {
		res.status(409).json({
			sucesso: false,
			msg: "Formato de entrada inválido."
		})
		return;
    }
    
    //Pesquisa no banco de dados a visita com o id passado como parâmetro via URL
	dataContext.Visita.findById(req.params.id)
	
	//Chama uma promise com os dados retornados da pesquisa
	.then(function(visitaRetornada){
		
		//Verifica se retornou algo
		if (!visitaRetornada) {
			res.status(404).json({
				sucesso: false,
				msg: "Visita não encontrada."
			})
			return;
		}

		//Exclui os dados da visita
        visitaRetornada.destroy()

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
				msg: "Falha ao excluir a visita" 
			});	
		})
    })
}

function atualizaVisita(req,res){
	//Verifica se o parâmetro passado via URL é um id
	if (!req.params.id) {
		res.status(409).json({
			sucesso: false,
			msg: "Formato de entrada inválido."
		})
		return;
	}

	//Variável que recebe os dados vindos do formulário
	let visita = req.body.visita;

	//Verifica se retornou algo
	if (!visita) {
		res.status(404).json({
			sucesso: false,
			msg: "Formato de entrada inválido."
		})
		return;
	}

	//Pesquisa no banco de dados a visita que corresponde ao id passado como parâmetro via URL
	dataContext.Visita.findById(req.params.id)
	
	//Cria uma promise passando como parâmetro os dados da pesquisa
	.then(function(visitaRetornada){
		
		//Verifica se retornou algo
		if (!visitaRetornada) {
			res.status(404).json({
				sucesso: false,
				msg: "Visita não encontrada."
			})
			return;
		}


		
		//Campos da visita que serão atualizados
		let updateFields = {
			dataHoraReserva			   : visita.dataHoraReserva,
			nomeConvidado			   : visita.nomeConvidado,
			pessoaId 				   : visita.pessoaId,
			condominoObservacao		   : visita.condominoObservacao,
			dataHoraExpiracao		   : visita.dataHoraExpiracao,
		}

		//Atualiza os campos da visita
		visitaRetornada.update(updateFields)

		//Cria uma promise que recebe como parâmetro o objeto visita com os dados atualizados
		.then(function(visitaAtualizada){
			res.status(200).json({
        		sucesso:true,
        		msg: "Registro atualizado com sucesso",
        		data: visitaAtualizada
        	})	
		})

		//Caso haja uma exceção
		.catch(function(erro){
			console.log(erro);
			res.status(409).json({ 
				sucesso: false,
				msg: "Falha ao atualizar a visita" 
			});	
		})
	})
}

function atualizaIdPessoa(req, res) {
	//Verifica se o parâmetro passado via URL é um id
	if (!req.params.id) {
		res.status(409).json({
			sucesso: false,
			msg: "Formato de entrada inválido."
		})
		return;
	}

	//Variável que recebe os dados vindos do formulário
	let visita = req.body.visita;

	//Verifica se retornou algo
	if (!visita) {
		res.status(404).json({
			sucesso: false,
			msg: "Formato de entrada inválido."
		})
		return;
	}

	//Pesquisa no banco de dados a visita que corresponde ao id passado como parâmetro via URL
	dataContext.Visita.findById(req.params.id)
	
	//Cria uma promise passando como parâmetro os dados da pesquisa
	.then(function(visitaRetornada){
		
		//Verifica se retornou algo
		if (!visitaRetornada) {
			res.status(404).json({
				sucesso: false,
				msg: "Visita não encontrada."
			})
			return;
		}

		//Campos da visita que serão atualizados
		let updateFields = {
			pessoaId 				   : visita.pessoaId,
			nomeConvidado			   : visita.nomeConvidado
		}

		//Atualiza os campos da visita
		visitaRetornada.update(updateFields)

		//Cria uma promise que recebe como parâmetro o objeto visita com os dados atualizados
		.then(function(visitaAtualizada){
			res.status(200).json({
        		sucesso:true,
        		msg: "Registro atualizado com sucesso",
        		data: visitaAtualizada
        	})	
		})

		//Caso haja uma exceção
		.catch(function(erro){
			console.log(erro);
			res.status(409).json({ 
				sucesso: false,
				msg: "Falha ao atualizar a visita" 
			});	
		})
	})
}

function atualizaSituacao(req, res) {
	//Verifica se o parâmetro passado via URL é um id
	if (!req.params.id) {
		res.status(409).json({
			sucesso: false,
			msg: "Formato de entrada inválido."
		})
		return;
	}

	//Variável que recebe os dados vindos do formulário
	let visita = req.body.visita;

	//Verifica se retornou algo
	if (!visita) {
		res.status(404).json({
			sucesso: false,
			msg: "Formato de entrada inválido."
		})
		return;
	}

	//Pesquisa no banco de dados a visita que corresponde ao id passado como parâmetro via URL
	dataContext.Visita.findById(req.params.id)
	
	//Cria uma promise passando como parâmetro os dados da pesquisa
	.then(function(visitaRetornada){
		
		//Verifica se retornou algo
		if (!visitaRetornada) {
			res.status(404).json({
				sucesso: false,
				msg: "Visita não encontrada."
			})
			return;
		}

		//Campos da visita que serão atualizados
		let updateFields = {
			situacao 		   : visita.situacao
		}

		//Atualiza os campos da visita
		visitaRetornada.update(updateFields)

		//Cria uma promise que recebe como parâmetro o objeto visita com os dados atualizados
		.then(function(visitaAtualizada){
			res.status(200).json({
        		sucesso:true,
        		msg: "Registro atualizado com sucesso",
        		data: visitaAtualizada
        	})	
		})

		//Caso haja uma exceção
		.catch(function(erro){
			console.log(erro);
			res.status(409).json({ 
				sucesso: false,
				msg: "Falha ao atualizar a visita" 
			});	
		})
	})
}

function atualizaPortaria(req, res) {
	//Verifica se o parâmetro passado via URL é um id
	if (!req.params.id) {
		res.status(409).json({
			sucesso: false,
			msg: "Formato de entrada inválido."
		})
		return;
	}

	//Variável que recebe os dados vindos do formulário
	let visita = req.body.visita;

	//Verifica se retornou algo
	if (!visita) {
		res.status(404).json({
			sucesso: false,
			msg: "Formato de entrada inválido."
		})
		return;
	}

	//Pesquisa no banco de dados a visita que corresponde ao id passado como parâmetro via URL
	dataContext.Visita.findById(req.params.id)
	
	//Cria uma promise passando como parâmetro os dados da pesquisa
	.then(function(visitaRetornada){
		
		//Verifica se retornou algo
		if (!visitaRetornada) {
			res.status(404).json({
				sucesso: false,
				msg: "Visita não encontrada."
			})
			return;
		}

		//Campos da visita que serão atualizados
		let updateFields = {
			situacao 		   				: visita.situacao,
			porteiroId 		   				: visita.porteiroId,
			portariaDataHoraChegada    		: visita.portariaDataHoraChegada,
			portariaObservacao 				: visita.portariaObservacao
		}

		//Atualiza os campos da visita
		visitaRetornada.update(updateFields)

		//Cria uma promise que recebe como parâmetro o objeto visita com os dados atualizados
		.then(function(visitaAtualizada){
			res.status(200).json({
        		sucesso:true,
        		msg: "Registro atualizado com sucesso",
        		data: visitaAtualizada
        	})	
		})

		//Caso haja uma exceção
		.catch(function(erro){
			console.log(erro);
			res.status(409).json({ 
				sucesso: false,
				msg: "Falha ao atualizar a visita" 
			});	
		})
	})
}

module.exports = {
	//Quando for consumir irá pegar os nomes da primeira tabela
    carregaTudo  		: carregaTudo,
    carregaPorId 		: carregaPorId,
    salva 				: salvaVisita,
    exclui 				: excluiVisita,
	atualiza 			: atualizaVisita,
	atualizaPessoa  	: atualizaIdPessoa,
	atualizaSituacao	: atualizaSituacao,
	atualizaPortaria 	: atualizaPortaria,	
}