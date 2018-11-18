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
        usuario = {
            email : condomino.usuario.email,
            senha : condomino.usuario.senha,
            tipo  : 2,
            desativado : false,
            criacao : new Date()
        },
        pessoa = {
            nome                : condomino.pessoa.nome,
            cpf                 : condomino.pessoa.cpf,
            nascimento          : condomino.pessoa.nascimento,
            digital             : util.criaDigital(),
            enderecoLogradouro  : condomino.pessoa.enderecoLogradouro,
            enderecoNumero      : condomino.pessoa.enderecoNumero,
            enderecoBairro      : condomino.pessoa.enderecoBairro,
            enderecoCidade      : condomino.pessoa.enderecoCidade,
            enderecoUf          : condomino.pessoa.enderecoUf,
            criacao             : new Date()
        }
    
    /**
     * {
     *      email: '',
     *      senha : '',
     *      nome : '',
     *      cpf : '',
     *      nascimento : '',
     *      endereco...
     * }
     *  */ 


	if (!condomino) {
		res.status(404).json({
			sucesso: false, 
			msg: "Formato de entrada inválido."
		})
		return;
	}    
    
    //variavel para receber o usuario criado devido ao "Clojure"
    let dadosUsuarioCriado;

    dataContext.Usuario.create(usuario)
    .then(function(novoUsuario){     
        dadosUsuarioCriado = novoUsuario;
        return dataContext.Pessoa.create(pessoa)
    })
    .then(function(novaPessoa){
       // resposta.pessoa = novaPessoa;
        return dataContext.Condomino.create({
            usuarioId : dadosUsuarioCriado.id,
            pessoaId  : novaPessoa.id, 
            endereco  : 'testando'
        })
    })
    .then(function(novoCondomino){
       // resposta.porteiro = novoPorteiro;
        
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
	if (!req.params.id) {
		res.status(409).json({
			sucesso: false,
			msg: "Formato de entrada inválido."
		})
		return;
	}

	dataContext.Condomino.findById(req.params.id).then(function(condomino){
        
		if (!condomino) {
			res.status(404).json({
				sucesso: false,
				msg: "Condomino não encontrado."
			})
			return;
		}

		condomino.destroy()
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
				msg: "Falha ao excluir o Condomino" 
			});	
		})

    })
	
}

function atualizaCondomino(req,res){
	
	if (!req.params.id) {
		res.status(409).json({
			sucesso: false,
			msg: "Formato de entrada inválido."
		})
		return;
	}

	//No front devo retornar um objeto pessoa com os dados
	let condomino	 = req.body.condomino;
	let condominoForm = req.body.condomino;

	if (!condomino && !condominoForm) {
		res.status(404).json({
			sucesso: false,
			msg: "Formato de entrada inválido."
		})
		return;
	}

	//Pesquise antes de atualizar
	dataContext.Condomino.findById(req.params.id).then(function(condominoRetornado){
	

		if (!condomino) {
			res.status(404).json({
				sucesso: false,
				msg: "Condomino não encontrada."
			})
			return;
		}

		return dataContext.Pessoa.findById(condominoRetornado.pessoaId)
	}).then(function(pessoa){

		let updateFields = {
			//Devo fazer como no C# 
			//Retornar o JSON com vários níveis
			
			nome 						: condominoForm.nome
			//nascimento 				: usuario.nascimento,
			//enderecoLogradouro 		: usuario.endereco.logradouro,
			//enderecoNumero 			: usuario.endereco.numero,
			//enderecoBairro 			: usuario.endereco.bairro,
			//enderecoCidade 			: usuario.endereco.cidade,
			//enderecoUf 				: usuario.endereco.uf,
			
		}

		pessoa.update(updateFields)
		.then(function(condominoAtualizado){
			res.status(200).json({
        		sucesso:true,
        		msg: "Registro atualizado com sucesso",
        		data: condominoAtualizado
        	})	
		})
		.catch(function(erro){
			console.log(erro);
			res.status(409).json({ 
				sucesso: false,
				msg: "Falha ao atualizar o condomino" 
			});	
		})

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