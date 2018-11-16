//Require quero o arquivo
const dataContext = require('../dao/dao');

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
            email : porteiro.email,
            senha : porteiro.senha,
            desativado : false,
            criacao : new Date()
        },
        pessoa = {
            nome                : porteiro.nome,
            cpf                 : porteiro.cpf,
            nascimento          : porteiro.nascimento,
            digital             : util.criaDigita(),
            criacao             : new Date(),
            enderecoLogradouro  : porteiro.endereco.logradouro
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
    
    let resposta;//variavel para receber o usuario criado devido ao "Clojure"

    dataContext.Usuario.create(usuario)
    .then(function(novoUsuario){        
        resposta.usuario = novoUsuario;
        return dataContext.Pessoa.create(pessoa)
    })
    .then(function(novaPessoa){
        resposta.pessoa = novaPessoa;
        
        return dataContext.Porteiro.create({
            usuarioId : resposta.usuario.id,
            pessoaId  : novaPessoa.id 
        })
    })
    .then(function(novoPorteiro){
        resposta.porteiro = novoPorteiro;
        
        res.status(201).json({
            sucesso : true,
            data : resposta
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
	let porteiro = req.body.porteiro;

	if (!porteiro) {
		res.status(404).json({
			sucesso: false,
			msg: "Formato de entrada inválido."
		})
		return;
	}

	//Pesquise antes de atualizar
	dataContext.Porteiro.findById(req.params.id).then(function(porteiro){
		
		if (!porteiro) {
			res.status(404).json({
				sucesso: false,
				msg: "Porteiro não encontrada."
			})
			return;
		}
		
		let updateFields = {
			//Devo fazer como no C# 
			//Retornar o JSON com vários níveis
			/*
			nome 					: usuario.nome,
			nascimento 				: usuario.nascimento,
			enderecoLogradouro 		: usuario.endereco.logradouro,
			enderecoNumero 			: usuario.endereco.numero,
			enderecoBairro 			: usuario.endereco.bairro,
			enderecoCidade 			: usuario.endereco.cidade,
			enderecoUf 				: usuario.endereco.uf,
			*/
		}

		porteiro.update(updateFields)
		.then(function(porteiroAtualizado){
			res.status(200).dataContext.json({
        		sucesso:true,
        		msg: "Registro atualizado com sucesso",
        		data: porteiroAtualizado
        	})	
		})
		.catch(function(erro){
			console.log(erro);
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