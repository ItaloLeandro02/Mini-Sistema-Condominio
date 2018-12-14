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

        if (tokenRetornado) {
            jwt.verify(tokenRetornado.token, JWT_KEY , function(err, decoded) {
                if (err) {
                    if (err.name == "TokenExpiredError") {
                        res.status(401).json({sucesso:false, mensagem:"Token expirado!", data: {} })
                        return;
                    } else {
                        res.status(401).json({sucesso:false, mensagem:"Token inválido! Efetue login novamente", data: {}});
                        return;
                    }
                }
        
                next();
            })
        }
    }) 
}


function signup(req,res){

    let email = req.body.email,
        senha = req.body.senha;
        tipo  = req.body.tipo;

    //Pesquisa por apenas um resultado, pois somente assim o método UPDATE poderá ser chamado
    return dataContext.Usuario.findOne({
        where : {
            email : email,
            senha : senha,
            tipo  : tipo
        }
    }).then(function(usuarioRetornado){

        //Verifica se retornou algo
		if (!usuarioRetornado) {
            res.status(401).json({sucesso:false, mensagem:"Email ou senha inválidos", data: {} })
            return 
        }
            //Caso tenha retornado
            let usuarioAutorizado = {        
                id      : usuarioRetornado.id, 
                nome    : usuarioRetornado.email
            }
            
            let updateFields = {
                token	:	jwt.sign(usuarioAutorizado, JWT_KEY, { expiresIn: '1h' }),
            }
          
            usuarioRetornado.update(updateFields)

                .then(function(usuarioAtualizado){
                    //Id é um campo sensível, logo escondemos ele
                    
                    resposta   = {};

                    switch (usuarioAtualizado.tipo) {
                        case 1:
                            dataContext.Porteiro.findOne({
                                where : {
                                    usuarioId : usuarioAtualizado.id
                                }, include : {
                                    model : dataContext.Pessoa
                                }
                            })
                            .then(function(porteiroRetornado) {
                            
                                resposta.usuario     = usuarioAtualizado;
                                resposta.porteiro    = porteiroRetornado   
                                resposta.token       = usuarioAtualizado.token;
            
                                    res.status(200).json({sucesso:true, mensagem:"Bem vindo", data: resposta })
                                    return 
                            })
                            break;
                        
                        case 2:
                            dataContext.Condomino.findOne({
                                where : {
                                    usuarioId : usuarioAtualizado.id
                                }, include : {
                                    model : dataContext.Pessoa
                                }
                            })
                            .then(function(condominoRetornado) {

                                resposta.usuario        = usuarioAtualizado;
                                resposta.condomino      = condominoRetornado   
                                resposta.token          = usuarioAtualizado.token;
            
                                    res.status(200).json({sucesso:true, mensagem:"Bem vindo", data: resposta })
                                    return 
                            })
                            break;

                        case 3:
                                resposta.usuario    = usuarioAtualizado;
                                resposta.token      = usuarioAtualizado.token;
            
                                    res.status(200).json({sucesso:true, mensagem:"Bem vindo", data: resposta })
                                    return 
   
                            break;        
                    
                        default:
                            break;
                    }
                })

                //Caso haja uma exceção
                .catch(function(erro){
                    res.status(401).json({sucesso:false, mensagem:"Houve um erro no login!", data: erro })
                    return 
                })  
    })
}


module.exports = {
    validaRequisicao : extraiAutorizacao,
    validaCredenciais: validaCredenciais,
    signUp           : signup
}