const JWT_KEY       = '0679ce86-6ca0-44c4-9820-cc800bca23fb';
const jwt           = require('jsonwebtoken');
const dataContext   = require('../dao/dao');



function extraiAutorizacao(req,res,next){
    if (req.method == "OPTIONS") {
        next();
        return;
    }

    var bearerToken;
    var bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        var bearer = bearerHeader.split(" ");
        bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.status(401).json({sucesso: false, mensagem:"Acesso não autorizado!"});
    }
}


function validaCredenciais(req,res,next){
    
    if (req.method == "OPTIONS") {
        next();
        return;
    }

    //Pesquisar o token no banco de dados
    return dataContext.Usuario.findOne({
        where : {
            token : req.token
        }
    }).then(function(tokenRetornado) {  

        jwt.verify(tokenRetornado.token, JWT_KEY , function(err, decoded) {
            if (err) {
                if (err.name == "TokenExpiredError") {
                    res.status(401).json({sucesso:false, mensagem:'Token expirado!',data: {}});
                    return;
                } else {
                    res.status(401).json({sucesso:false, mensagem:"Token inválido! Efetue login novamente", data: {}});
                    return;
                }
            }

            console.log('Toklen')
            console.log(tokenRetornado.token)
     
            next();
    })
/*
    jwt.verify(req.token, JWT_KEY , function(err, decoded) {
        if (err) {
            if (err.name == "TokenExpiredError") {
                res.status(401).json({sucesso:false, mensagem: req.token,data: {}});
                return;
            } else {
                res.status(401).json({sucesso:false, mensagem:"Token inválido! Efetue login novamente", data: {}});
                return;
            }
        }

        //Pesquisar se o token existe, pesquisando na tabela de usuário pelo token
        // find req.token

        next();
*/  
    }) 
}


function signup(req,res){

    let email = req.body.email,
        senha = req.body.senha;

    //Pesquisa por apenas um resultado, pois somente assim o método UPDATE poderá ser chamado
    return dataContext.Usuario.findOne({
        where : {
            email : email,
            senha : senha
        }
    }).then(function(usuarioRetornado){

        //Verifica se retornou algo
		if (!usuarioRetornado) {
			res.status(401).json({
				sucesso: false,
                mensagem:"Email ou senha inválidos!",
                data: {}
			})
			return;
        }
            //Caso tenha retornado
            let usuarioAutorizado = {        
                id      : usuarioRetornado.id, 
                nome    : usuarioRetornado.email
            }
            
            let updateFields = {
                token	:	jwt.sign(usuarioAutorizado, JWT_KEY, { expiresIn: '3000' }),
            }
          
            usuarioRetornado.update(updateFields)

                .then(function(usuarioAtualizado){
                    //Id é um campo sensível, logo escondemos ele
                    resposta   = {};

                    resposta.usuario = usuarioAtualizado.email;    
                    resposta.token = usuarioAtualizado.token;

                    res.status(200).json({sucesso:true, mensagem:"Bem vindo", data: resposta })
                })

                //Caso haja uma exceção
                .catch(function(erro){
                    res.status(409).json({ 
                        sucesso: false,
                        msg: "Houve um erro no Login",
                        data: erro
                    });	
                })
    })
    //Find eemail e a senha
    //Ipdate no campo token
    //Resposta com o token
/*
    let token      = jwt.sign(usuarioAutorizado, JWT_KEY, { expiresIn: '10000' }),
        //Id é um campo sensível, logo escondemos ele
        resposta   = {};

    resposta.usuario = 'Usuario da API JWT';    
    resposta.token = token;

    res.status(200).json({sucesso:true, mensagem:"Bem vindo", data: resposta })
    */
}


module.exports = {
    validaRequisicao : extraiAutorizacao,
    validaCredenciais: validaCredenciais,
    signUp           : signup
}