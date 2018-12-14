//Importar um módulo sequelize usando require('sequelize'). Assim Sequelize representa uma variável de referência ao Sequelize.
//Configurações
let express   = require('express'),
 path         = require('path'),
 logger       = require('morgan'),
 cookieParser = require('cookie-parser'),
 bodyParser   = require('body-parser');

const rota                = require('./rotas/rota'),
      rotaAutenticacao    = require('./seguranca/autenticacao.rota'),
      auth                = require('./seguranca/autenticacao')


const app = express();


// uncomment after placing your favicon in /public
app.use(logger('dev'));
//Transforma tudo que vem em JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));



// Ativar CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
  //Dois métodos POST executando em seguida
  //Continua executando a API
  next();
});

/// Funcao de login não pode ser validada pelo "validaRequisicao"
app.use(rotaAutenticacao)

///A partir daqui, toda requisição deve estar "autorizada"
//App servidor
//Vai ser executando antes da rota
//Antes de executar a rota ele valida, continua se lee tive autorizado e caso esteja ok o Next faz com que ele continue a executação
app.use(auth.validaRequisicao)


/*
Declaração de mapeamento das rotas da API
*/
app.use('/api', auth.validaCredenciais, rota);  




// Caso nao encontre o "caminho" solicitado
app.use(function(req, res, next) {
  	var err = new Error('Não encontrado');
  	err.status = 404;
  	next(err);
});


// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.log(err);
    res.json({
      sucesso : false,
      mensagem: err.message,
      data: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  console.log(err);
  res.json({
    sucesso : false,
    mensagem: err.message,
    data: {}
  });
});


module.exports = app;