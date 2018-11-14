let express = require('express'),
 path = require('path'),
 logger = require('morgan'),
 cookieParser = require('cookie-parser'),
 bodyParser = require('body-parser');

let rota = require('./rotas/rota');


let app = express();


// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));



// Ativar CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
  next();
});





app.use('/api', rota);






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