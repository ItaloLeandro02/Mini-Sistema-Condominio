//Require quero o arquivo
const dataContext = require('../dao/dao'),
      util        = require('../util/util');	

//Orem influência o nome mão
//Primeiro requisição
function carregaTudo(req,res) {
    
    return dataContext.Porteiro.findAll({
		//Procura a Primary Key
    	order : 'id'
    }).then(function(porteiros){
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
                model       : dataContext.Usuario,
                attributes : ['email','desativado']
            },
            {
                model : dataContext.Pessoa
            }
        ]    
    }).then(function(porteiro){
        
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
        usuario = {
            email : porteiro.usuario.email,
            senha : porteiro.usuario.senha,
            tipo  : 3,
            desativado : false,
            criacao : new Date()
        },
        pessoa = {
            nome                : porteiro.pessoa.nome,
            cpf                 : porteiro.pessoa.cpf,
            nascimento          : porteiro.pessoa.nascimento,
            digital             : util.criaDigital(),
            enderecoLogradouro  : porteiro.pessoa.enderecoLogradouro,
            enderecoNumero      : porteiro.pessoa.enderecoNumero,
            enderecoBairro      : porteiro.pessoa.enderecoBairro,
            enderecoCidade      : porteiro.pessoa.enderecoCidade,
            enderecoUf          : porteiro.pessoa.enderecoUf,
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


	if (!porteiro) {
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
        return dataContext.Porteiro.create({
            usuarioId : dadosUsuarioCriado.id,
            pessoaId  : novaPessoa.id 
        })
    })
    .then(function(novoPorteiro){
       // resposta.porteiro = novoPorteiro;
        
        res.status(201).json({
            sucesso : true,
            data : porteiro
        })
    })
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

	dataContext.Porteiro.findById(req.params.id).then(function(porteiro){
        
		if (!porteiro) {
			res.status(404).json({
				sucesso: false,
				msg: "Porteiro não encontrado."
			})
			return;
		}

		porteiro.destroy()
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
				msg: "Falha ao excluir o usuário" 
			});	
		})

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

	//No front devo retornar um objeto pessoa com os dados
	let porteiro	 = req.body.porteiro;
	let porteiroForm = req.body.porteiro;

	if (!porteiro && !porteiroForm) {
		res.status(404).json({
			sucesso: false,
			msg: "Formato de entrada inválido."
		})
		return;
	}

	//Pesquise antes de atualizar
	dataContext.Porteiro.findById(req.params.id).then(function(porteiroRetornado){
	

		if (!porteiro) {
			res.status(404).json({
				sucesso: false,
				msg: "Porteiro não encontrada."
			})
			return;
		}

		return dataContext.Pessoa.findById(porteiroRetornado.pessoaId)
	}).then(function(pessoa){

		let updateFields = {
			//Devo fazer como no C# 
			//Retornar o JSON com vários níveis
			
			nome 						: porteiroForm.nome
			//nascimento 				: usuario.nascimento,
			//enderecoLogradouro 		: usuario.endereco.logradouro,
			//enderecoNumero 			: usuario.endereco.numero,
			//enderecoBairro 			: usuario.endereco.bairro,
			//enderecoCidade 			: usuario.endereco.cidade,
			//enderecoUf 				: usuario.endereco.uf,
			
		}

		pessoa.update(updateFields)
		.then(function(porteiroAtualizado){
			res.status(200).json({
        		sucesso:true,
        		msg: "Registro atualizado com sucesso",
        		data: porteiroAtualizado
        	})	
		})
		.catch(function(erro){
			console.log(porteiro);
			res.status(409).json({ 
				sucesso: false,
				msg: "Falha ao atualizar o porteiro" 
			});	
		})

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