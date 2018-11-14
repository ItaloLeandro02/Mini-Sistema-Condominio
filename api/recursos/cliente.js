let dataset = require('../dao/dao');

function carregaTudo(req,res) {
    
    return dataset.Pessoa.findAll({
    	order : 'id'
    }).then(function(pessoas){
        res.json({
        	sucesso:true,
        	data: pessoas
        })
    })


}    


function carregaPorId(req,res) {
    
    return dataset.Pessoa.findById(req.params.id).then(function(pessoa){
        res.json(pessoa)
    })


} 

function salvaCliente(req,res){
	let cliente = req.body.cliente;

	if (!cliente) {
		res.json({msg: "Formato de entrada inválido."})
		return;
	}

	/*
	Validação pelo "build" do modelo Pessoa
	let clienteBuild = dataset.Pessoa.build(cliente);
	clienteBuild.validate().then(function(erro){
		console.log(erro.message);
	});
	*/

	
	dataset.Pessoa.create(cliente)
	.then(function(novoCliente){
		res.json({sucesso: true, data: novoCliente})
	})
	.catch(function(erro){
		console.log(erro);
		res.json({ msg: "Falha ao incluir o novo cliente" });
	})
}

function excluiCliente(req,res){
	if (!req.params.id) {
		res.json({msg: "Formato de entrada inválido."})
		return;
	}

	dataset.Pessoa.findById(req.params.id).then(function(pessoa){
        
		if (!pessoa) {
			res.status(404).json({msg: "Pessoa não encontrada."})
			return;
		}

		pessoa.destroy()
		.then(function(){
			res.json({
        		sucesso:true,
        		msg: "Registro excluído com sucesso",
        		data: []
        	})	        	
		})
		.catch(function(erro){
			console.log(erro);
			res.json({ msg: "Falha ao excluir o cliente" });	
		})

    })
	
}

function atualizaCliente(req,res){
	
	if (!req.params.id) {
		res.json({msg: "Formato de entrada inválido."})
		return;
	}

	let cliente = req.body.cliente;

	if (!cliente) {
		res.json({msg: "Formato de entrada inválido."})
		return;
	}


	dataset.Pessoa.findById(req.params.id).then(function(pessoa){
		
		if (!pessoa) {
			res.status(404).json({msg: "Pessoa não encontrada."})
			return;
		}
		
		let updateFields = {
			nome : cliente.nome,
			idade : cliente.idade
		}

		pessoa.update(updateFields)
		.then(function(pessoaAtualiza){
			res.json({
        		sucesso:true,
        		msg: "Registro atualizado com sucesso",
        		data: pessoaAtualiza
        	})	
		})
		.catch(function(erro){
			console.log(erro);
			res.json({ msg: "Falha ao atualizar o cliente" });	
		})

	})
	
}




module.exports = {
    carregaTudo  	: carregaTudo,
    carregaPorId 	: carregaPorId,
    salva 			: salvaCliente,
    exclui 			: excluiCliente,
    atualiza 		: atualizaCliente    
}